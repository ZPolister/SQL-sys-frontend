import { Dialog, Form, Input, DatePicker, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import { $app } from "../../../app/app";
import { HealthCheckReminderDto, HealthCheckReminder } from "../../../api";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: HealthCheckReminderDto | null;
  reminderId?: number | null;
}

export default function HealthCheckDialog({ visible, onClose, onSuccess, editData, reminderId }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HealthCheckReminderDto>({
    checkFrequencyDays: 30,
    scheduledTime: new Date(),
    reminderContent: "",
  });

  useEffect(() => {
    if (visible && editData) {
      setFormData({
        checkFrequencyDays: editData.checkFrequencyDays,
        scheduledTime: editData.scheduledTime ? new Date(editData.scheduledTime) : new Date(),
        reminderContent: editData.reminderContent,
      });
    } else if (visible) {
      setFormData({
        checkFrequencyDays: 30,
        scheduledTime: new Date(),
        reminderContent: "",
      });
    }
  }, [visible, editData]);
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const api = $app.$DefaultApi;

      let result;
      if (reminderId) {
        // 编辑模式
        result = await api.putHealthCheckReminderId({
          id: reminderId,
          healthCheckReminderDto: formData,
        });
      } else {
        // 新增模式
        result = await api.postHealthCheckReminder({
          healthCheckReminderDto: formData,
        });
      }
      if (result.code === 200) {
        await MessagePlugin.success("添加成功");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
      await MessagePlugin.error("添加失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={editData ? "编辑体检提醒" : "新增体检提醒"}
      visible={visible}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmLoading={loading}
    >
      <Form>
        <Form.FormItem label="提醒内容" initialData={editData ? editData.reminderContent : ""} >
          <Input
            value={formData.reminderContent}
            onChange={(value) =>
              setFormData({ ...formData, reminderContent: String(value) })
            }
            placeholder="请输入提醒内容"
          />
        </Form.FormItem>
        <Form.FormItem label="体检频率(天)" initialData={editData ? editData.checkFrequencyDays : 30}>
          <Input
            // value={formData.checkFrequencyDays}
            onChange={(value) =>
              setFormData({
                ...formData,
                checkFrequencyDays: Number(value),
              })
            }
            placeholder="请输入体检频率"
          />
        </Form.FormItem>
        <Form.FormItem label="计划体检时间" initialData={editData ? editData.scheduledTime : new Date()}>
          <DatePicker
            value={formData.scheduledTime}
            onChange={(value) =>
              setFormData({
                ...formData,
                scheduledTime: value ? new Date(value.toLocaleString()) : new Date(),
              })
            }
            mode="date"
          />
        </Form.FormItem>
      </Form>
    </Dialog>
  );
}