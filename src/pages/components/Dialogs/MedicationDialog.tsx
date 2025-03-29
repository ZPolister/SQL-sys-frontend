import { Dialog, Form, Input, InputNumber, DatePicker, TimePicker, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import { MedicationReminderDto, MedicationReminder } from "../../../api";
import { $app } from "../../../app/app";
import FormItem from "tdesign-react/es/form/FormItem";

interface MedicationDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MedicationReminder;
}

export default function MedicationDialog({ visible, onClose, onSuccess, initialData }: MedicationDialogProps) {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<MedicationReminderDto & { reminderTimes: string[] }>({
    medicationName: "",
    medicationDosage: "",
    medicationFrequency: 1,
    medicationDuration: 7,
    reminderContent: "",
    reminderTime: "[]",
    startTime: new Date(),
    reminderTimes: ["08:00"],
  });

  // 重置或设置初始表单数据
  useEffect(() => {
    // 每次 visible 或 initialData 变化时都重置表单
    if (initialData && visible) {
      // 编辑模式：设置初始数据
      const reminderTimes = JSON.parse(initialData.reminderTime || "[]");
      setFormData({
        medicationName: initialData.medicationName || "",
        medicationDosage: initialData.medicationDosage || "",
        medicationFrequency: initialData.medicationFrequency || 1,
        medicationDuration: initialData.medicationDuration || 7,
        reminderTime: initialData.reminderTime || "[]",
        startTime: initialData.startTime ? new Date(initialData.startTime) : new Date(),
        reminderTimes: Array.isArray(reminderTimes) ? reminderTimes : [reminderTimes],
      });
    } else {
      // 新增模式或对话框关闭时：重置表单
      setFormData({
        medicationName: "",
        medicationDosage: "",
        medicationFrequency: 1,
        medicationDuration: 7,
        reminderContent: "",
        reminderTime: "[]",
        startTime: new Date(),
        reminderTimes: ["08:00"],
      });
    }
    form.reset();
  }, [visible, initialData]);
  // 当服药频率改变时，调整时间数组长度
  useEffect(() => {
    const currentTimes = [...formData.reminderTimes];
    if (currentTimes.length < formData.medicationFrequency) {
      // 需要添加时间点
      while (currentTimes.length < formData.medicationFrequency) {
        const lastTime = currentTimes[currentTimes.length - 1] || "08:00";
        const [hours, minutes] = lastTime.split(":").map(Number);
        let newHours = hours + 4; // 默认间隔4小时
        if (newHours >= 24) {
          newHours = 8; // 如果超过24小时，重置为早上8点
        }
        currentTimes.push(`${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
      }
    } else if (currentTimes.length > formData.medicationFrequency) {
      // 需要减少时间点
      currentTimes.splice(formData.medicationFrequency);
    }
    setFormData(prev => ({
      ...prev,
      reminderTimes: currentTimes,
      reminderTime: JSON.stringify(currentTimes),
    }));
  }, [formData.medicationFrequency]);

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.medicationName) {
      await MessagePlugin.error("药品名称不能为空");
      return;
    }
    if (!formData.medicationDosage) {
      await MessagePlugin.error("药品剂量不能为空");
      return;
    }
    if (formData.reminderTimes.length === 0) {
      await MessagePlugin.error("提醒时间不能为空");
      return;
    }

    const api = $app.$DefaultApi;
    try {
      const submitData = {
        ...formData,
        reminderTime: JSON.stringify(formData.reminderTimes),
      };

      let result;
      if (initialData?.reminderId !== undefined) {
        // 更新
        result = await api.putMedicationReminderReminderId({
          reminderId: initialData.reminderId,
          medicationReminderDto: submitData,
        });
      } else {
        // 新增
        result = await api.postMedicationReminder({
          medicationReminderDto: submitData,
        });
      }

      if (result.code === 200) {
        await MessagePlugin.success(result.msg || (initialData ? "更新服药提醒成功" : "添加服药提醒成功"));
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || (initialData ? "更新服药提醒失败" : "添加服药提醒失败"));
      }
    } catch (error) {
      await MessagePlugin.error("操作失败，请检查网络连接");
      console.error(error);
    }
  };

  const handleTimeChange = (val: string, index: number) => {
    if (val) {
      const newTimes = [...formData.reminderTimes];
      newTimes[index] = val;
      setFormData(prev => ({
        ...prev,
        reminderTimes: newTimes,
        reminderTime: JSON.stringify(newTimes),
      }));
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header={initialData ? "编辑服药提醒" : "新增服药提醒"}
      confirmBtn="提交"
      onConfirm={handleSubmit}
    >
      <Form>
        <FormItem label="药品名称" required initialData={formData.medicationName}>
          <Input
            placeholder="请输入药品名称"
            onChange={(val) => setFormData({ ...formData, medicationName: val as string })}
          />
        </FormItem>
        <FormItem label="药品剂量" required initialData={formData.medicationDosage}>
          <Input
            placeholder="如: 5mg/片, 2片/次"
            onChange={(val) => setFormData({ ...formData, medicationDosage: val as string })}
          />
        </FormItem>
        <FormItem label="每日服药次数" initialData={formData.medicationFrequency}>
          <InputNumber
            min={1}
            max={10}
            onChange={(val) => setFormData({ ...formData, medicationFrequency: val as number })}
          />
        </FormItem>
        <FormItem label="服药持续天数" initialData={formData.medicationDuration}>
          <InputNumber
            min={1}
            max={365}
            onChange={(val) => setFormData({ ...formData, medicationDuration: val as number })}
          />
        </FormItem>
        {formData.reminderTimes.map((time, index) => (
          <FormItem
            key={index}
            label={formData.medicationFrequency > 1 ? `提醒时间 ${index + 1}` : "提醒时间"}
            required
            initialData={time}
          >
            <TimePicker
              format="HH:mm"
              onChange={(val) => handleTimeChange(val as string, index)}
            />
          </FormItem>
        ))}
        <FormItem label="开始服药时间" initialData={formData.startTime}>
          <DatePicker
            mode="date"
            format="YYYY-MM-DD"
            onChange={(val) => {
              if (val) {
                setFormData({ ...formData, startTime: new Date(val) });
              }
            }}
          />
        </FormItem>
      </Form>
    </Dialog>
  );
}