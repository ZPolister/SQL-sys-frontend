import { Dialog, Form, InputNumber, DatePicker, MessagePlugin, Select } from "tdesign-react";
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
    targetValue: undefined as unknown as number,
    targetDate: new Date(),
  });
  const [loading, setLoading] = useState(false);

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      setFormData({
        goalCategory: "WEIGHT_LOSS",
        targetValue: undefined as unknown as number,
        targetDate: new Date(),
      });
    }
  }, [visible]);

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.targetValue || formData.targetValue <= 0) {
      await MessagePlugin.error("请输入有效的目标值");
      return;
    }

    if (!formData.targetDate) {
      await MessagePlugin.error("请选择目标日期");
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getUnitLabel = () => {
    switch (formData.goalCategory) {
      case "WEIGHT_LOSS":
        return " (kg)";
      case "EXERCISE_CALORIES":
        return " (kcal)";
      default:
        return " (mmol/L)";
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="设置健康目标"
      confirmBtn={{ content: "提交", loading }}
      cancelBtn="取消"
      onConfirm={handleSubmit}
      destroyOnClose
    >
      <div className="p-2" style={{ color: 'var(--td-text-color-primary)' }}>
        <Form>
          <Form.FormItem label="目标类型">
            <Select
              value={formData.goalCategory}
              onChange={(val) => setFormData({...formData, goalCategory: val as string})}
              options={goalCategories}
              placeholder="请选择目标类型"
              className="w-full"
              style={{ 
                '--td-select-hover-bg-color': 'var(--td-bg-color-container-hover)',
                '--td-select-active-bg-color': 'var(--td-bg-color-container-active)'
              } as React.CSSProperties}
            />
          </Form.FormItem>
          <Form.FormItem label={`目标值${getUnitLabel()}`}>
            <InputNumber
              value={formData.targetValue}
              onChange={(val) => {
                if (val !== null) {
                  setFormData({...formData, targetValue: val as any});
                }
              }}
              decimalPlaces={2}
              min={0}
              theme="normal"
              placeholder="请输入目标值"
              style={{ 
                '--td-input-bg-color': 'var(--td-bg-color-container)',
                '--td-input-border-color': 'var(--td-component-border)',
                width: '100%'
              } as React.CSSProperties}
            />
          </Form.FormItem>
          <Form.FormItem label="目标日期">
            <DatePicker
              value={formData.targetDate}
              onChange={(val) => {
                if (val) {
                  setFormData({...formData, targetDate: new Date(val as any)});
                }
              }}
              mode="date"
              format="YYYY-MM-DD"
              placeholder="请选择目标日期"
              style={{ 
                '--td-datepicker-bg-color': 'var(--td-bg-color-container)',
                '--td-datepicker-border-color': 'var(--td-component-border)'
              } as React.CSSProperties}
            />
          </Form.FormItem>
        </Form>
      </div>
    </Dialog>
  );
}