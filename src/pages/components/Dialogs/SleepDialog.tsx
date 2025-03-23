import { Dialog, Form, DatePicker, Select, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import { SleepLogDto } from "../../../api";
import { $app } from "../../../app/app";

interface SleepDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SleepDialog({ visible, onClose, onSuccess }: SleepDialogProps) {
  const [formData, setFormData] = useState<SleepLogDto>({
    sleepStart: new Date(),
    sleepEnd: new Date(),
    sleepQuality: 3,
  });

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      setFormData({
        sleepStart: new Date(),
        sleepEnd: new Date(),
        sleepQuality: 3,
      });
    }
  }, [visible]);

  const handleSubmit = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.postSleep({ sleepLogDto: formData });
      if (result.code === 200) {
        await MessagePlugin.success(result.msg || "添加睡眠记录成功");
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || "添加睡眠记录失败");
      }
    } catch (error) {
      await MessagePlugin.error("添加睡眠记录失败，请检查网络连接");
      console.error(error);
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="新增睡眠记录"
      confirmBtn="提交"
      onConfirm={handleSubmit}
    >
      <Form>
        <Form.FormItem label="入睡时间">
          <DatePicker
            enableTimePicker
            format="YYYY-MM-DD HH:mm:ss"
            value={formData.sleepStart}
            onChange={(val) => {
              if (val) {
                const date = new Date(val);
                setFormData({ ...formData, sleepStart: date });
              }
            }}
          />
        </Form.FormItem>
        <Form.FormItem label="醒来时间">
          <DatePicker
            enableTimePicker
            format="YYYY-MM-DD HH:mm:ss"
            value={formData.sleepEnd}
            onChange={(val) => {
              if (val) {
                const date = new Date(val);
                setFormData({ ...formData, sleepEnd: date });
              }
            }}
          />
        </Form.FormItem>
        <Form.FormItem label="睡眠质量">
          <Select
            value={formData.sleepQuality}
            onChange={(val) => setFormData({ ...formData, sleepQuality: val as number })}
            options={[
              { label: "1级", value: 1 },
              { label: "2级", value: 2 },
              { label: "3级", value: 3 },
              { label: "4级", value: 4 },
              { label: "5级", value: 5 },
            ]}
          />
        </Form.FormItem>
      </Form>
    </Dialog>
  );
}