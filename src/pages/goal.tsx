import {useEffect, useRef, useState} from "react";
import {Button, Card, DatePicker, Dialog, Form, InputNumber, Progress} from "tdesign-react";
import {$app} from "../app/app";
import {HealthGoalDto, ResponseResultHealthGoal} from "../api";

interface GoalSuggestion {
  goalCategory: "WEIGHT_LOSS" | "BLOOD_SUGAR" | "BLOOD_LIPID" | "EXERCISE_CALORIES";
  targetValue: number;
  targetDate: string;
}

export default function Goal() {
  const [currentGoal, setCurrentGoal] = useState<ResponseResultHealthGoal | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [goalSuggestion, setGoalSuggestion] = useState<GoalSuggestion | null>(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<HealthGoalDto>({
    goalCategory: "WEIGHT_LOSS",
    targetValue: 0,
    targetDate: new Date(),
  });

  // 用于存储流式数据的解码器
  const decoder = new TextDecoder();
  const analysisText = useRef("");

  useEffect(() => {
    fetchCurrentGoal();
    fetchAnalysis();
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
    const api = $app.$DefaultApi;
    try {
      const response = await api.getAnalysisStream() as Response;
      console.log("获取分析流式响应:", response, response instanceof ReadableStream);

      if (response.body instanceof ReadableStream) {
        const reader = response.body.getReader();
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          console.log("得到文本:", text);

          analysisText.current += text;

          // 查找并解析目标建议
          const goalMatch = analysisText.current.match(/<goal>(.*?)<\/goal>/);
          if (goalMatch) {
            try {
              const goalData = JSON.parse(goalMatch[1]);
              console.log("目标建议:", goalData);
              setGoalSuggestion(goalData);
            } catch (e) {
              console.error("解析目标建议失败:", e);
            }
          }

          // 将文本按行分割并更新状态
          setAnalysis(analysisText.current.split("\n").filter(line => line.trim()));
        }
      }
    } catch (error) {
      console.error("获取分析失败:", error);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    const min = Math.min(current, target);
    const max = Math.max(current, target);
    return Math.round((min / max) * 100);
  };

  const handleCreateGoal = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.postHealthGoals({
        healthGoalDto: {
          ...formData,
          targetDate: formData.targetDate
        }
      });
      if (result.code === 200) {
        setVisible(false);
        fetchCurrentGoal();
      }
    } catch (error) {
      console.error("创建目标失败:", error);
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
        fetchCurrentGoal();
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
      <Card title="当前目标">
        {currentGoal?.data ? (
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">
                {renderGoalCategory(currentGoal.data.goalCategory as string)}
              </h3>
              <p className="text-gray-600">
                目标值: {currentGoal.data.targetValue}
                {currentGoal.data.goalCategory === "WEIGHT_LOSS" && " kg"}
                {currentGoal.data.goalCategory === "EXERCISE_CALORIES" && " kcal"}
                {currentGoal.data.goalCategory === "BLOOD_SUGAR" && " mmol/L"}
                {currentGoal.data.goalCategory === "BLOOD_LIPID" && " mmol/L"}
              </p>
              <p className="text-gray-600">
                目标日期: {currentGoal.data.targetDate}
              </p>
            </div>
            <div className="w-32">
              <Progress
                theme="circle"
                percentage={calculateProgress(currentGoal.data.currentValue || 0, currentGoal.data.targetValue as number)}
                status={currentGoal.data.currentValue >= currentGoal.data.targetValue ? "success" : "warning"}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">暂无目标</p>
            <Button theme="primary" onClick={() => setVisible(true)}>
              创建目标
            </Button>
          </div>
        )}
      </Card>

      {/* 健康建议卡片 */}
      <Card title="健康建议">
        <div className="space-y-4">
          {analysis.map((line, index) => {
            // 排除包含<goal>标签的行
            if (!line.includes("<goal>")) {
              return <p key={index} className="text-gray-700">{line}</p>;
            }
            return null;
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
              <p className="mb-4">目标日期：{new Date(goalSuggestion.targetDate).toLocaleDateString()}</p>
              <Button theme="primary" onClick={handleQuickCreateGoal}>
                采纳建议
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 创建目标对话框 */}
      <Dialog
        visible={visible}
        onClose={() => setVisible(false)}
        header="创建健康目标"
      >
        <Form onSubmit={handleCreateGoal}>
          <Form.FormItem label="目标类型">
            <select
              className="w-full px-4 py-2 border rounded"
              value={formData.goalCategory}
              onChange={(e) => setFormData({...formData, goalCategory: e.target.value})}
            >
              <option value="WEIGHT_LOSS">减重目标</option>
              <option value="BLOOD_SUGAR">血糖控制</option>
              <option value="BLOOD_LIPID">血脂控制</option>
              <option value="EXERCISE_CALORIES">运动热量</option>
            </select>
          </Form.FormItem>
          <Form.FormItem label="目标值">
            <InputNumber
              value={formData.targetValue}
              onChange={(val) => setFormData({...formData, targetValue: val})}
            />
          </Form.FormItem>
          <Form.FormItem label="目标日期">
            <DatePicker
              value={formData.targetDate}
              onChange={(val) => {
                if (val) {
                  setFormData({...formData, targetDate: new Date(val)});
                }
              }}
            />
          </Form.FormItem>
          <Button type="submit">提交</Button>
        </Form>
      </Dialog>
    </div>
  );
}
