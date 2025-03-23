import { Dialog, Form, InputNumber, DatePicker, Input, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import { ExerciseLogDto } from "../../../api";
import { $app } from "../../../app/app";

interface ExerciseDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExerciseDialog({ visible, onClose, onSuccess }: ExerciseDialogProps) {
  const [formData, setFormData] = useState<ExerciseLogDto>({
    exerciseType: "",
    durationMinutes: 0,
    caloriesBurned: 0,
    startTimestamp: new Date().getTime(),
  });

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      setFormData({
        exerciseType: "",
        durationMinutes: 0,
        caloriesBurned: 0,
        startTimestamp: new Date().getTime(),
      });
    }
  }, [visible]);

  const handleSubmit = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.postExercise({ exerciseLogDto: formData });
      if (result.code === 200) {
        await MessagePlugin.success(result.msg || "添加运动记录成功");
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || "添加运动记录失败");
      }
    } catch (error) {
      await MessagePlugin.error("添加运动记录失败，请检查网络连接");
      console.error(error);
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="新增运动记录"
      confirmBtn="提交"
      onConfirm={handleSubmit}
    >
      <Form>
        <Form.FormItem label="运动类型">
          <Input
            value={formData.exerciseType}
            onChange={(val) => setFormData({ ...formData, exerciseType: val })}
          />
        </Form.FormItem>
        <Form.FormItem label="时长 (分钟)">
          <InputNumber
            value={formData.durationMinutes}
            onChange={(val) =>
              setFormData({ ...formData, durationMinutes: val })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="消耗热量 (千卡)">
          <InputNumber
            value={formData.caloriesBurned}
            onChange={(val) =>
              setFormData({ ...formData, caloriesBurned: val })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="运动开始时间">
          <DatePicker
            enableTimePicker
            format="YYYY-MM-DD HH:mm:ss"
            value={
              formData.startTimestamp
                ? new Date(formData.startTimestamp)
                : undefined
            }
            onChange={(val) => {
              if (val) {
                const date = new Date(val);
                setFormData({ ...formData, startTimestamp: date.getTime() });
              }
            }}
          />
        </Form.FormItem>
      </Form>
    </Dialog>
  );
}