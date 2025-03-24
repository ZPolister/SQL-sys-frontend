import {useEffect, useRef, useState} from "react";
import {Button, Card, Progress, MessagePlugin, DialogPlugin} from "tdesign-react";
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

  // 用于存储流式数据的解码器
  // const decoder = new TextDecoder();
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

    // const api = $app.$DefaultApi;
    // const decoder = new TextDecoder(); // 初始化解码器
    // let buffer = ''; // 用于缓存未解析的数据

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
      parseGoal(analysisText.current)
    };

        // 解析缓存中的数据，去除 `data:` 前缀和换行符
        // const {parsedText, remainingBuffer} = parseBuffer(buffer);
        // buffer = remainingBuffer; // 更新缓存

        // console.log("text", parsedText)

        // 更新状态
        // if (parsedText) {
        //   analysisText.current += parsedText;
        //   updateAnalysis(analysisText.current);
        // }

    // const trimText = (rawText: string): string => {
    //   // return (rawText.replace(/data:/g, '').replace(/\n\n/g, ""))
    //   const match = rawText.match(/(?<=data:)([\s\S]*?)(?=\n\n)/);
    //   console.log("match", match?.[0])
    //
    //   if (match) {
    //     return match[0].replace(/\ndata:/g, "\n");
    //   } else {
    //     return ""
    //   }
    // }

    // try {
    //   const response = await api.getAnalysisStream(
    //     {},
    //     {signal: abortController.current.signal}
    //   ) as Response;
    //
    //   if (!response.body) {
    //     throw new Error("响应体为空");
    //   }
    //
    //   const reader = response.body.getReader();
    //
    //   analysisText.current = '';
    //
    //   while (true) {
    //     // 检查是否被取消
    //     if (currentFetchController.signal.aborted) {
    //       console.log("取消请求")
    //       await reader.cancel()
    //       return;
    //     }
    //
    //     const {done, value} = await reader.read();
    //     if (done) break; // 流结束
    //
    //     const decodedText = decoder.decode(value, {stream: true});
    //     console.log("解码数据块:", decodedText)
    //
    //     // 解码数据块并追加到缓存中
    //     // buffer += decodedText
    //     const parsedText = trimText(decodedText)
    //
    //     // 解析缓存中的数据，去除 `data:` 前缀和换行符
    //     // const {parsedText, remainingBuffer} = parseBuffer(buffer);
    //     // buffer = remainingBuffer; // 更新缓存
    //
    //     // console.log("text", parsedText)
    //
    //     // 更新状态
    //     if (parsedText) {
    //       analysisText.current += parsedText;
    //       updateAnalysis(analysisText.current);
    //     }
    //
    //     // 查找并解析目标建议
    //     parseGoal(analysisText.current);
    //   }
    //
    //   console.log("请求完成", analysisText.current)
    // } catch (error) {
    //   console.error("获取分析失败:", error);
    // }

  };

  /**
   * 解析缓存中的数据，去除 `data:` 前缀和换行符
   * @param {string} buffer - 缓存数据
   * @returns {Object} - { parsedText: string, remainingBuffer: string }
   */
  // const parseBuffer = (buffer) => {
  //   // 按换行符分割数据块
  //   const lines = buffer.split("\n");
  //
  //   // 解析每行数据，去除 `data:` 前缀
  //   const parsedLines = lines
  //     .map(line => line.trim()) // 去除空白字符
  //     .filter(line => line.startsWith("data:")) // 过滤以 `data:` 开头的行
  //     .map(line => line.slice(5).trim()); // 去除 `data:` 前缀并去除空白字符
  //
  //   // 将解析后的行合并为文本
  //   const parsedText = parsedLines.join("\n");
  //
  //   // 保留未解析的部分（最后一行的未完成数据）
  //   const remainingBuffer = lines[lines.length - 1].startsWith("data:") ? '' : lines[lines.length - 1];
  //
  //   return {parsedText, remainingBuffer};
  // };

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
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">
                {renderGoalCategory(currentGoal.data.goalCategory as string)}
              </h3>
              <p className="text-xl mb-3">
                <span className="text-gray-600">目标值: </span>
                <span className="font-bold">
                  {currentGoal.data.targetValue}
                  {currentGoal.data.goalCategory === "WEIGHT_LOSS" && " kg"}
                  {currentGoal.data.goalCategory === "EXERCISE_CALORIES" && " kcal"}
                  {currentGoal.data.goalCategory === "BLOOD_SUGAR" && " mmol/L"}
                  {currentGoal.data.goalCategory === "BLOOD_LIPID" && " mmol/L"}
                </span>
              </p>
              <p className="text-xl mb-3">
                <span className="text-gray-600">目标日期: </span>
                <span className="font-bold">
                  {toDateString(new Date(currentGoal.data.targetDate as any))}
                </span>
              </p>
              <p className="text-xl mb-3">
                <span className="text-gray-600">当前进度: </span>
                <span className="font-bold">
                  {calculateProgress(
                    currentGoal.data.currentValue || 0,
                    currentGoal.data.targetValue as number,
                    currentGoal.data.goalCategory as string
                  )} %
                </span>
              </p>
            </div>
            <div className="w-32">
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
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 mb-6">暂无目标</p>
            <Button theme="primary" size="large" onClick={() => setShowGoalDialog(true)}>
              创建目标
            </Button>
          </div>
        )}
      </Card>

      {/* 健康建议卡片 */}
      <Card title="健康建议">
        <div className="space-y-4">
          {analysis.length > 0 ? (
            <>
              {analysis.map((line, index) => {
                return <p key={index} className="text-gray-700">{line}</p>;
              })}

              {goalSuggestion && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">建议目标</h4>
                  <p className="mb-2">
                    {renderGoalCategory(goalSuggestion.goalCategory)}：
                    {goalSuggestion.targetValue}
                    {goalSuggestion.goalCategory === "WEIGHT_LOSS" && " kg"}
                    {goalSuggestion.goalCategory === "EXERCISE_CALORIES" && " kcal"}
                    {goalSuggestion.goalCategory === "BLOOD_SUGAR" && " mmol/L"}
                    {goalSuggestion.goalCategory === "BLOOD_LIPID" && " mmol/L"}
                  </p>
                  <p className="mb-4">目标日期：{toDateString(new Date(goalSuggestion.targetDate))}</p>
                  <Button theme="primary" onClick={handleQuickCreateGoal}>
                    采纳建议
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">点击按钮获取个性化健康建议</p>
              <Button theme="primary" onClick={fetchAnalysis}>
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
