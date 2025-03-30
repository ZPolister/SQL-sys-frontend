import { Dialog, Input, InputNumber, DatePicker, TimePicker, MessagePlugin, Button, Checkbox } from "tdesign-react";
import { useState, useEffect } from "react";
import { MedicationReminderDto } from "../../../api";
import { $app } from "../../../app/app";

interface RecognizedMedicationsDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  recognizedMedications: MedicationReminderDto[];
}

// 根据频率生成提醒时间数组
const generateReminderTimes = (frequency: number): string[] => {
  const times: string[] = [];
  for (let i = 0; i < frequency; i++) {
    if (i === 0) {
      times.push("08:00"); // 第一次默认早上8点
    } else {
      // 根据上一个时间点计算下一个时间点
      const lastTime = times[i - 1];
      const [hours, minutes] = lastTime.split(":").map(Number);
      let newHours = hours + 4; // 默认间隔4小时
      if (newHours >= 24) {
        newHours = 8; // 如果超过24小时，重置为早上8点
      }
      times.push(`${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
    }
  }
  return times;
};

export default function RecognizedMedicationsDialog({ 
  visible, 
  onClose, 
  onSuccess, 
  recognizedMedications 
}: RecognizedMedicationsDialogProps) {
  const [selectedMedications, setSelectedMedications] = useState<(MedicationReminderDto & { 
    reminderTimes: string[],
    selected: boolean 
  })[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (visible && recognizedMedications.length > 0) {
      const initialMedications = recognizedMedications.map(med => {
        // 确保频率至少为1
        const frequency = Math.max(1, med.medicationFrequency || 1);
        // 根据频率生成对应数量的提醒时间
        const reminderTimes = generateReminderTimes(frequency);
        
        return {
          ...med,
          medicationFrequency: frequency,
          reminderTimes,
          reminderTime: JSON.stringify(reminderTimes),
          startTime: new Date(),
          selected: true // 默认选中所有药品
        };
      });
      setSelectedMedications(initialMedications);
    } else {
      setSelectedMedications([]);
    }
  }, [visible, recognizedMedications]);

  // 更新提醒时间数组
  const updateReminderTimes = (medication: any, index: number) => {
    const frequency = Math.max(1, medication.medicationFrequency || 1);
    const currentTimes = [...(medication.reminderTimes || ["08:00"])];
    
    if (currentTimes.length < frequency) {
      // 需要添加时间点
      while (currentTimes.length < frequency) {
        const lastTime = currentTimes[currentTimes.length - 1] || "08:00";
        const [hours, minutes] = lastTime.split(":").map(Number);
        let newHours = hours + 4; // 默认间隔4小时
        if (newHours >= 24) {
          newHours = 8; // 如果超过24小时，重置为早上8点
        }
        currentTimes.push(`${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
      }
    } else if (currentTimes.length > frequency) {
      // 需要减少时间点
      currentTimes.splice(frequency);
    }

    const updatedMedication = {
      ...medication,
      reminderTimes: currentTimes,
      reminderTime: JSON.stringify(currentTimes),
    };

    const newSelectedMedications = [...selectedMedications];
    newSelectedMedications[index] = updatedMedication;
    setSelectedMedications(newSelectedMedications);
  };

  // 处理字段变更
  const handleMedicationChange = (index: number, field: string, value: any) => {
    const newSelectedMedications = [...selectedMedications];
    newSelectedMedications[index] = {
      ...newSelectedMedications[index],
      [field]: value,
    };
    
    // 如果修改的是服药频率，需要立即更新提醒时间
    if (field === 'medicationFrequency') {
      // 先更新频率，再调用更新提醒时间的函数
      updateReminderTimes(newSelectedMedications[index], index);
    } else {
      setSelectedMedications(newSelectedMedications);
    }
  };

  // 处理时间变更
  const handleTimeChange = (val: string, medicationIndex: number, timeIndex: number) => {
    if (val) {
      const newSelectedMedications = [...selectedMedications];
      const medication = newSelectedMedications[medicationIndex];
      const newTimes = [...(medication.reminderTimes || [])];
      newTimes[timeIndex] = val;
      newSelectedMedications[medicationIndex] = {
        ...medication,
        reminderTimes: newTimes,
        reminderTime: JSON.stringify(newTimes),
      };
      setSelectedMedications(newSelectedMedications);
    }
  };

  // 处理选择状态变更
  const handleSelectionChange = (index: number, selected: boolean) => {
    const newSelectedMedications = [...selectedMedications];
    newSelectedMedications[index] = {
      ...newSelectedMedications[index],
      selected,
    };
    setSelectedMedications(newSelectedMedications);
  };

  // 批量提交
  const handleSubmit = async () => {
    // 获取所有选中的药品
    const medicationsToSubmit = selectedMedications
      .filter(med => med.selected)
      .map(({ selected, ...rest }) => rest); // 移除 selected 字段

    // 表单验证
    for (const medication of medicationsToSubmit) {
      if (!medication.medicationName) {
        await MessagePlugin.error("药品名称不能为空");
        return;
      }
      if (!medication.medicationDosage) {
        await MessagePlugin.error("药品剂量不能为空");
        return;
      }
    }

    if (medicationsToSubmit.length === 0) {
      await MessagePlugin.error("请至少选择一种药品");
      return;
    }

    setSubmitting(true);
    try {
      // 使用批量接口
      const result = await $app.$DefaultApi.postMedicationReminderBatch({
        medicationReminderDto: medicationsToSubmit,
      });

      if (result.code === 200) {
        await MessagePlugin.success(result.msg || "批量添加服药提醒成功");
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || "批量添加服药提醒失败");
      }
    } catch (error) {
      await MessagePlugin.error("操作失败，请检查网络连接");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="识别到的药品信息"
      width={800}
      footer={
        <div className="flex justify-end gap-2">
          <Button theme="default" onClick={onClose}>取消</Button>
          <Button theme="primary" loading={submitting} onClick={handleSubmit}>
            批量添加
          </Button>
        </div>
      }
    >
      <div className="mb-4">
        <p className="text-gray-600">共识别到 {selectedMedications.length} 种药品，请选择需要添加的药品并确认信息：</p>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto p-2">
        {selectedMedications.map((medication, index) => (
          <div 
            key={index} 
            style={{ 
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: medication.selected ? 'var(--td-brand-color)' : 'var(--td-component-border)',
              transition: 'border-color 0.2s ease-in-out'
            }}
            className="p-4 rounded-lg mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Checkbox
                  checked={medication.selected}
                  onChange={checked => handleSelectionChange(index, checked)}
                />
                <h3 className="text-lg font-medium ml-2">药品 {index + 1}</h3>
              </div>
            </div>

            <div className="space-y-4 pl-8">
              <div className="flex items-center">
                <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
                  药品名称
                  <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
                </label>
                <Input
                  value={medication.medicationName}
                  onChange={(val) => handleMedicationChange(index, 'medicationName', val)}
                  placeholder="请输入药品名称"
                  className="flex-1"
                  disabled={!medication.selected}
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
                  药品剂量
                  <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
                </label>
                <Input
                  value={medication.medicationDosage}
                  onChange={(val) => handleMedicationChange(index, 'medicationDosage', val)}
                  placeholder="如: 5mg/片, 2片/次"
                  className="flex-1"
                  disabled={!medication.selected}
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>每日服药次数</label>
                <InputNumber
                  value={medication.medicationFrequency}
                  onChange={(val) => handleMedicationChange(index, 'medicationFrequency', val)}
                  min={1}
                  max={10}
                  className="flex-1"
                  disabled={!medication.selected}
                />
              </div>

              <div className="flex items-center">
                <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>服药持续天数</label>
                <InputNumber
                  value={medication.medicationDuration}
                  onChange={(val) => handleMedicationChange(index, 'medicationDuration', val)}
                  min={1}
                  max={365}
                  className="flex-1"
                  disabled={!medication.selected}
                />
              </div>

              {(medication.reminderTimes || []).map((time, timeIndex) => (
                <div key={timeIndex} className="flex items-center">
                  <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
                    {medication.medicationFrequency > 1 ? `提醒时间 ${timeIndex + 1}` : "提醒时间"}
                    <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
                  </label>
                  <TimePicker
                    value={time}
                    format="HH:mm"
                    onChange={(val) => handleTimeChange(val as string, index, timeIndex)}
                    className="flex-1"
                    disabled={!medication.selected}
                  />
                </div>
              ))}

              <div className="flex items-center">
                <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>开始服药时间</label>
                <DatePicker
                  value={medication.startTime}
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={(val) => {
                    if (val) {
                      handleMedicationChange(index, 'startTime', new Date(val as any));
                    }
                  }}
                  className="flex-1"
                  disabled={!medication.selected}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}