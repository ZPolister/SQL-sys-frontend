import {useEffect, useRef, useState} from "react";
import {Button, Card, Progress, MessagePlugin, DialogPlugin, Row, Col, Statistic, Tag, Divider} from "tdesign-react";
import {$app} from "../app/app";
import {DeleteHealthGoalsGoalIdRequest, ResponseResultHealthGoal} from "../api";
import GoalDialog from "./components/Dialogs/GoalDialog";

interface GoalSuggestion {
  goalCategory: "WEIGHT_LOSS" | "BLOOD_SUGAR" | "BLOOD_LIPID" | "EXERCISE_CALORIES";
  targetValue: number;
  targetDate: string;
}

const toDateString = (dt: Date) => {
  // 获取时间信息
  const year = dt.getFullYear(); // 2021
  const month = dt.getMonth(); // 8
  const date = dt.getDate(); // 23
  // 拼接成字符串
  return `${year}-${month + 1}-${date}`;
};

export default function Goal() {
  const [currentGoal, setCurrentGoal] = useState<ResponseResultHealthGoal | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [goalSuggestion, setGoalSuggestion] = useState<GoalSuggestion | null>(null);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  // 用于存储流式数据的解码器
  const analysisText = useRef("");

  const abortController = useRef<any>(new AbortController());

  useEffect(() => {
    abortController.current = new AbortController();
    fetchCurrentGoal().finally();
    // 不再自动获取建议，改为按钮触发

    return () => {
      console.log("组件卸载")
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  const fetchCurrentGoal = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.getHealthGoalsCurrent();
      if (result.code === 200) {
        setCurrentGoal(result);
      }
    } catch (error) {
      console.error("获取目标失败:", error);
    }
  };

  const fetchAnalysis = async () => {
    console.log("发起请求")
    const currentFetchController = abortController.current;
    
    // 重置状态
    setIsGenerating(true);
    setIsGenerationComplete(false);
    analysisText.current = "";
    setAnalysis([]);
    setGoalSuggestion(null);

    const evtSrc = new EventSource("/api/analysis/stream");

    evtSrc.onopen = (event) => {
      if (currentFetchController.signal.aborted) {
        console.log("取消请求")
        evtSrc.close();
        return;
      }

      analysisText.current = ""
      console.log("事件源打开:", event);
    };

    evtSrc.onmessage = (event) => {
      if (currentFetchController.signal.aborted) {
        console.log("取消请求")
        evtSrc.close();
        return;
      }
      console.log("接收到事件:", event.data)
      analysisText.current += event.data;
      updateAnalysis(analysisText.current);
    };

    evtSrc.onerror = (error) => {
      console.log("事件源错误或结束:", error);
      evtSrc.close();
      parseGoal(analysisText.current);
      setIsGenerationComplete(true);
    };
  };

  // 停止生成
  const stopGeneration = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
      setIsGenerationComplete(true);
    }
  };

  /**
   * 更新分析结果状态
   * @param {string} text - 待更新的文本
   */
  const updateAnalysis = (text: string) => {
    const replacedText = text.replace(/```([\s\S]*?)```/, "").trim()
    const lines = replacedText.split("\n")
    setAnalysis(lines); // 更新状态
  };

  /**
   * 解析目标建议并更新状态
   * @param {string} text - 待解析的文本
   */
  const parseGoal = (text: string) => {
    let goalMatch = text.match(
      /(?<=```json)([\s\S]*?)(?=```)/
    );

    if (!goalMatch) {
      goalMatch = text.match(
        /(?<=```)([\s\S]*?)(?=```)/
      )
    }

    if (goalMatch) {
      const goalText = (goalMatch[1]).trim();

      console.log("目标建议文本:", goalText);

      try {
        const goalData = JSON.parse(goalText);
        console.log("目标建议:", goalData);
        setGoalSuggestion(goalData);
      } catch (e) {
        console.error("解析目标建议失败:", e);
      }
    }
  };

  const calculateProgress = (current: number, target: number, category?: string) => {
    if (category === 'EXERCISE_CALORIES') {
      // 运动热量：当前值除以目标值
      return Math.round((current / target) * 100);
    } else {
      // 其他目标：目标值除以当前值
      return Math.round((target / current) * 100);
    }
  };

  const handleAbandonGoal = () => {
    if (!currentGoal?.data?.goalId) {
      MessagePlugin.error('没有可放弃的目标').finally();
      return;
    }

    // 显示二次确认对话框
    const dialog = DialogPlugin.confirm({
      header: '确认放弃目标',
      body: `确定要放弃"${renderGoalCategory(currentGoal.data.goalCategory as string)}"目标吗？此操作不可恢复。`,
      confirmBtn: {
        theme: 'danger',
        content: '确认放弃',
      },
      cancelBtn: '取消',
      onConfirm: async () => {
        try {
          await $app.$DefaultApi.deleteHealthGoalsGoalId(
            {goalId: currentGoal.data?.goalId} as DeleteHealthGoalsGoalIdRequest);
          await MessagePlugin.success('目标已放弃');
          await fetchCurrentGoal();
          // 确保对话框关闭
          dialog.hide();
        } catch (error) {
          console.error('放弃目标失败:', error);
          await MessagePlugin.error('放弃目标失败');
        }
      },
    });
    oncancel: () => {
      dialog.hide();
    }
  };

  const handleQuickCreateGoal = async () => {
    if (!goalSuggestion) return;

    const api = $app.$DefaultApi;
    try {
      const result = await api.postHealthGoals({
        healthGoalDto: {
          goalCategory: goalSuggestion.goalCategory,
          targetValue: goalSuggestion.targetValue,
          targetDate: new Date(goalSuggestion.targetDate)
        }
      });
      if (result.code === 200) {
        await MessagePlugin.success('目标设置成功！');
        await fetchCurrentGoal();
      }
    } catch (error) {
      console.error("快速创建目标失败:", error);
    }
  };

  const renderGoalCategory = (category: string) => {
    const categories = {
      WEIGHT_LOSS: "减重目标",
      BLOOD_SUGAR: "血糖控制",
      BLOOD_LIPID: "血脂控制",
      EXERCISE_CALORIES: "运动热量"
    };
    return categories[category as keyof typeof categories] || category;
  };

  // 目标状态映射
  const goalStatusMap: Record<number, { text: string; theme: 'success' | 'warning' | 'default' }> = {
    0: { text: '进行中', theme: 'default' },
    1: { text: '已达成', theme: 'success' },
    2: { text: '未达成', theme: 'warning' }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* 当前目标卡片 */}
      <Card
        title="当前目标"
        actions={
          <div className="flex gap-2">
            <Button theme="primary" onClick={() => setShowGoalDialog(true)}>
              {!currentGoal?.data ? "创建目标" :
               currentGoal.data.goalStatus === 1 ? "设定新目标" : "重设目标"}
            </Button>
            {currentGoal?.data && currentGoal.data.goalStatus !== 1 && (
              <Button theme="danger" variant="outline" onClick={handleAbandonGoal}>
                放弃目标
              </Button>
            )}
          </div>
        }
      >
        {currentGoal?.data ? (
          <div className="w-full flex flex-col gap-4 p-4">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div className="text-sm mb-2" style={{ color: 'var(--td-text-color-secondary)' }}>目标类型</div>
                <div className="text-xl font-medium">
                  {renderGoalCategory(currentGoal.data.goalCategory as string)}
                  <Tag theme={goalStatusMap[currentGoal.data.goalStatus as number]?.theme || 'default'} className="mt-2 ml-2">
                  {goalStatusMap[currentGoal.data.goalStatus as number]?.text || '进行中'}
                </Tag>
                </div>
              </Col>
              <Col span={6}>
                <Statistic 
                  title="目标值" 
                  value={Number(currentGoal.data.targetValue)} 
                  unit={currentGoal.data.goalCategory === 'EXERCISE_CALORIES' ? '千卡' :
                        currentGoal.data.goalCategory === 'WEIGHT_LOSS' ? 'kg' : 'mmol/L'} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="当前值" 
                  value={Number(currentGoal.data.currentValue || 0)} 
                  unit={currentGoal.data.goalCategory === 'EXERCISE_CALORIES' ? '千卡' :
                        currentGoal.data.goalCategory === 'WEIGHT_LOSS' ? 'kg' : 'mmol/L'} 
                />
              </Col>
              <Col span={6}>
                {/* <div className="flex items-center justify-center h-full">
                  <Progress
                    theme="circle"
                    percentage={calculateProgress(
                      currentGoal.data.currentValue || 0,
                      currentGoal.data.targetValue as number,
                      currentGoal.data.goalCategory as string
                    )}
                    status={
                      currentGoal.data.goalCategory === 'EXERCISE_CALORIES'
                        ? (currentGoal.data.currentValue >= currentGoal.data.targetValue ? "success" : "warning")
                        : (currentGoal.data.currentValue <= currentGoal.data.targetValue ? "success" : "warning")
                    }
                  />
                </div> */}
                <div className="text-sm mb-2" style={{ color: 'var(--td-text-color-secondary)' }}>达成截止日期</div>
                <div className="text-xl font-medium">
                {toDateString(new Date(currentGoal.data.targetDate as any))}
                </div>
              </Col>
            </Row>
            {/* <Row>
              <Col span={12}>
                <div className="text-sm" style={{ color: 'var(--td-text-color-secondary)' }}>
                  目标日期：{toDateString(new Date(currentGoal.data.targetDate as any))}
                </div>
              </Col>
            </Row> */}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl mb-6" style={{ color: 'var(--td-text-color-secondary)' }}>暂无目标</p>
            <Button theme="primary" size="large" onClick={() => setShowGoalDialog(true)}>
              创建目标
            </Button>
          </div>
        )}
      </Card>

      {/* 健康建议卡片 */}
      <Card title="健康建议">
        <div className="space-y-4" style={{ color: 'var(--td-text-color-primary)' }}>
          {analysis.length > 0 ? (
            <>
              <div className="mb-4">
                {analysis.map((line, index) => {
                  return <p key={index} className="mb-2" style={{ color: 'var(--td-text-color-secondary)' }}>{line}</p>;
                })}
              </div>

              {goalSuggestion && (
                <div className="mt-4 p-4 rounded-lg" style={{ 
                  backgroundColor: 'var(--td-bg-color-container-hover)',
                  borderLeft: '4px solid var(--td-brand-color)'
                }}>
                  <h4 className="text-lg font-medium mb-2" style={{ color: 'var(--td-text-color-primary)' }}>建议目标</h4>
                  <Divider style={{ margin: '12px 0' }} />
                  <Row gutter={[16, 16]} className="mb-4">
                    <Col span={8}>
                      <div className="flex flex-col">
                        <div className="text-sm mb-1" style={{ color: 'var(--td-text-color-secondary)' }}>目标类型</div>
                        <div className="text-xl font-medium">
                          {renderGoalCategory(goalSuggestion.goalCategory)}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="目标值" 
                        value={Number(goalSuggestion.targetValue)}
                        unit={goalSuggestion.goalCategory === 'EXERCISE_CALORIES' ? '千卡' :
                              goalSuggestion.goalCategory === 'WEIGHT_LOSS' ? 'kg' : 'mmol/L'} 
                      />
                    </Col>
                    <Col span={8}>
                      <div className="flex flex-col">
                        <div className="text-sm mb-1" style={{ color: 'var(--td-text-color-secondary)' }}>目标日期</div>
                        <div className="text-xxl font-large">
                          {toDateString(new Date(goalSuggestion.targetDate))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Button theme="primary" onClick={handleQuickCreateGoal}>
                    采纳建议
                  </Button>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                {isGenerationComplete ? (
                  <Button theme="primary" onClick={fetchAnalysis}>
                    重新生成
                  </Button>
                ) : (
                  <Button theme="danger" onClick={stopGeneration}>
                    停止生成
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="mb-6" style={{ color: 'var(--td-text-color-secondary)' }}>点击获取属于你的个性化健康建议！</p>
              <Button theme="primary" onClick={fetchAnalysis} loading={isGenerating && !analysis.length}>
                获取建议
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 目标对话框组件 */}
      <GoalDialog
        visible={showGoalDialog}
        onClose={() => setShowGoalDialog(false)}
        onSuccess={() => {
          setShowGoalDialog(false);
          // 刷新数据
          fetchCurrentGoal().finally();
        }}
      />
    </div>
  );
}