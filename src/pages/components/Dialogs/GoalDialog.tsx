import { Dialog, Form, InputNumber, DatePicker, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import { HealthGoalDto } from "../../../api";
import { $app } from "../../../app/app";

interface GoalDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const goalCategories = [
  { value: "WEIGHT_LOSS", label: "减重目标" },
  { value: "BLOOD_SUGAR", label: "血糖控制" },
  { value: "BLOOD_LIPID", label: "血脂控制" },
  { value: "EXERCISE_CALORIES", label: "运动热量" }
];

const toDateString = (dt: Date) => {
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const date = dt.getDate();
  return `${year}-${month + 1}-${date}`;
};

export default function GoalDialog({ visible, onClose, onSuccess }: GoalDialogProps) {
  const [formData, setFormData] = useState<HealthGoalDto>({
    goalCategory: "WEIGHT_LOSS",
    targetValue: 0,
    targetDate: new Date(),
  });

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      setFormData({
        goalCategory: "WEIGHT_LOSS",
        targetValue: 0,
        targetDate: new Date(),
      });
    }
  }, [visible]);

  const handleSubmit = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.postHealthGoals({
        healthGoalDto: {
          ...formData,
          targetDate: formData.targetDate
        }
      });
      if (result.code === 200) {
        await MessagePlugin.success("目标设置成功！");
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || "设置目标失败");
      }
    } catch (error) {
      await MessagePlugin.error("设置目标失败，请检查网络连接");
      console.error(error);
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="设置健康目标"
      confirmBtn="提交"
      onConfirm={handleSubmit}
    >
      <Form>
        <Form.FormItem label="目标类型">
          <select
            className="w-full px-4 py-2 border rounded"
            value={formData.goalCategory}
            onChange={(e) => setFormData({...formData, goalCategory: e.target.value})}
          >
            {goalCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </Form.FormItem>
        <Form.FormItem label={`目标值${
          formData.goalCategory === "WEIGHT_LOSS" ? " (kg)" :
          formData.goalCategory === "EXERCISE_CALORIES" ? " (kcal)" :
          " (mmol/L)"
        }`}>
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
      </Form>
    </Dialog>
  );
}