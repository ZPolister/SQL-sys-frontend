import { Dialog, Input, DatePicker, MessagePlugin, Button, InputNumber } from "tdesign-react";
import { useState, useEffect } from "react";
import { $app } from "../../../app/app";
import { HealthCheckReminderDto } from "../../../api";

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
    // 表单验证
    if (!formData.reminderContent) {
      await MessagePlugin.error("提醒内容不能为空");
      return;
    }
    if (!formData.checkFrequencyDays || formData.checkFrequencyDays < 1) {
      await MessagePlugin.error("请输入有效的体检频率");
      return;
    }
    if (!formData.scheduledTime) {
      await MessagePlugin.error("请选择计划体检时间");
      return;
    }

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
        await MessagePlugin.success(reminderId ? "更新成功" : "添加成功");
        onSuccess();
        onClose();
      } else {
        await MessagePlugin.error(result.msg || (reminderId ? "更新失败" : "添加失败"));
      }
    } catch (error) {
      console.error(error);
      await MessagePlugin.error("操作失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={editData ? "编辑体检提醒" : "新增体检提醒"}
      visible={visible}
      onClose={onClose}
      width={500}
      footer={
        <div className="flex justify-end gap-2">
          <Button theme="default" onClick={onClose}>取消</Button>
          <Button theme="primary" loading={loading} onClick={handleSubmit}>
            {editData ? "更新" : "添加"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 p-2">
        <div className="flex items-center">
          <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
            提醒内容
            <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
          </label>
          <Input
            value={formData.reminderContent}
            onChange={(value) => setFormData({ ...formData, reminderContent: String(value) })}
            placeholder="请输入提醒内容"
            className="flex-1"
          />
        </div>

        <div className="flex items-center">
          <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
            体检频率(天)
            <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
          </label>
          <InputNumber
            value={formData.checkFrequencyDays}
            onChange={(value) => setFormData({ ...formData, checkFrequencyDays: Number(value) })}
            min={1}
            max={365}
            className="flex-1"
            placeholder="请输入体检频率"
          />
        </div>

        <div className="flex items-center">
          <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
            计划体检时间
            <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
          </label>
          <DatePicker
            value={formData.scheduledTime}
            onChange={(value) => setFormData({
              ...formData,
              scheduledTime: value ? new Date(value as any) : new Date(),
            })}
            mode="date"
            format="YYYY-MM-DD"
            className="flex-1"
            placeholder="请选择计划体检时间"
          />
        </div>
      </div>
    </Dialog>
  );
}