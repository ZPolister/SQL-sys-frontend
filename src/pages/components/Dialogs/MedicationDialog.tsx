import { Dialog, Input, InputNumber, DatePicker, TimePicker, MessagePlugin, Upload, Button } from "tdesign-react";
import { useState, useEffect } from "react";
import { MedicationReminderDto, MedicationReminder, MedicationReminderVo } from "../../../api";
import { $app } from "../../../app/app";
import RecognizedMedicationsDialog from "./RecognizedMedicationsDialog";

interface MedicationDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MedicationReminder;
}

const convertVoToDto = (vo: MedicationReminderVo): MedicationReminderDto => {
  return {
    medicationName: vo.medicationName || "",
    medicationDosage: vo.medicationDosage || "",
    medicationFrequency: vo.medicationFrequency || 1,
    medicationDuration: vo.medicationDuration || 7,
    reminderTime: JSON.stringify(["08:00"]), // 默认早上8点
    startTime: new Date(), // 默认当前时间
  };
};

export default function MedicationDialog({ visible, onClose, onSuccess, initialData }: MedicationDialogProps) {
  const [uploading, setUploading] = useState(false);
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

  // 识别结果对话框的状态
  const [recognizedDialogVisible, setRecognizedDialogVisible] = useState(false);
  const [recognizedMedications, setRecognizedMedications] = useState<MedicationReminderDto[]>([]);

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

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await $app.$DefaultApi.postMedicationReminderPng(formData);

      console.log('处方/说明书识别结果:', result);

      if (result.code === 200 && result.data) {
        await MessagePlugin.success('识别成功');
        
        // 处理返回的多条药品信息，将 Vo 转换为 Dto
        if (Array.isArray(result.data)) {
          const convertedData = result.data.map(vo => convertVoToDto(vo));
          setRecognizedMedications(convertedData);
          setRecognizedDialogVisible(true);
        } else {
          await MessagePlugin.error('未识别到药品信息');
          setRecognizedMedications([]); // 清空已识别的药品列表 
        }

      } else {
        await MessagePlugin.error(result.msg || '识别失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      await MessagePlugin.error('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Dialog
        visible={visible}
        onClose={onClose}
        header={initialData ? "编辑服药提醒" : "新增服药提醒"}
        confirmBtn="提交"
        onConfirm={handleSubmit}
        footer={
          <div className="flex justify-between items-center w-full">
            <div>
              {!initialData && (
                <Upload
                  allowUploadDuplicateFile
                  accept="image/*"
                  theme="custom"
                  autoUpload={false}
                  disabled={uploading}
                  onChange={(files) => {
                    const file = files[0]?.raw;
                    if (file) {
                      handleUpload(file).finally();
                    }
                  }}
                >
                  <Button loading={uploading} variant="outline" style={{ width: '120px' }}>
                    {uploading ? '识别中...' : '上传处方图片识别'}
                  </Button>
                </Upload>
              )}
            </div>
            <div className="flex gap-2">
              <Button theme="default" onClick={onClose}>取消</Button>
              <Button theme="primary" loading={uploading} onClick={handleSubmit}>提交</Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center">
            <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
              药品名称
              <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
            </label>
            <Input
              value={formData.medicationName}
              onChange={(val) => setFormData({ ...formData, medicationName: val as string })}
              placeholder="请输入药品名称"
              className="flex-1"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
              药品剂量
              <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
            </label>
            <Input
              value={formData.medicationDosage}
              onChange={(val) => setFormData({ ...formData, medicationDosage: val as string })}
              placeholder="如: 5mg/片, 2片/次"
              className="flex-1"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>每日服药次数</label>
            <InputNumber
              value={formData.medicationFrequency}
              onChange={(val) => setFormData({ ...formData, medicationFrequency: val as number })}
              min={1}
              max={10}
              className="flex-1"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>服药持续天数</label>
            <InputNumber
              value={formData.medicationDuration}
              onChange={(val) => setFormData({ ...formData, medicationDuration: val as number })}
              min={1}
              max={365}
              className="flex-1"
            />
          </div>

          {formData.reminderTimes.map((time, index) => (
            <div key={index} className="flex items-center">
              <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>
                {formData.medicationFrequency > 1 ? `提醒时间 ${index + 1}` : "提醒时间"}
                <span style={{ color: 'var(--td-error-color)' }} className="ml-0.5">*</span>
              </label>
              <TimePicker
                value={time}
                format="HH:mm"
                onChange={(val) => handleTimeChange(val as string, index)}
                className="flex-1"
              />
            </div>
          ))}

          <div className="flex items-center">
            <label className="w-32 flex-shrink-0" style={{ color: 'var(--td-text-color-primary)' }}>开始服药时间</label>
            <DatePicker
              value={formData.startTime}
              mode="date"
              format="YYYY-MM-DD"
              onChange={(val) => {
                if (val) {
                  setFormData({ ...formData, startTime: new Date(val as any) });
                }
              }}
              className="flex-1"
            />
          </div>
        </div>
      </Dialog>

      {/* 识别结果对话框 */}
      <RecognizedMedicationsDialog
        visible={recognizedDialogVisible}
        onClose={() => setRecognizedDialogVisible(false)}
        onSuccess={() => {
          setRecognizedDialogVisible(false);
          onSuccess();
          onClose();
        }}
        recognizedMedications={recognizedMedications}
      />
    </>
  );
}