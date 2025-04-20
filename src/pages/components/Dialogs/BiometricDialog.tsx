import { Dialog, Form, InputNumber, DatePicker, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import { BiometricRecordDto } from "../../../api";
import { $app } from "../../../app/app";

interface BiometricDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BiometricDialog({ visible, onClose, onSuccess }: BiometricDialogProps) {
  const [formData, setFormData] = useState<BiometricRecordDto>({
    heightCm: 0,
    weightKg: 0,
    systolicPressure: 0,
    diastolicPressure: 0,
    bloodGlucose: 0,
    bloodLipid: 0,
    measurementTime: new Date().getTime(),
  });

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      setFormData({
        heightCm: 0,
        weightKg: 0,
        systolicPressure: 0,
        diastolicPressure: 0,
        bloodGlucose: 0,
        bloodLipid: 0,
        measurementTime: new Date().getTime(),
      });
    }
  }, [visible]);

  const handleSubmit = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.postHealthBiometric({
        biometricRecordDto: formData,
      });
      if (result.code === 200) {
        await MessagePlugin.success(result.msg || "添加体征数据成功");
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || "添加体征数据失败");
      }
    } catch (error) {
      await MessagePlugin.error("添加体征数据失败，请检查网络连接");
      console.error(error);
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="新增体征数据"
      confirmBtn="提交"
      onConfirm={handleSubmit}
    >
      <Form>
        <Form.FormItem label="身高 (cm)">
          <InputNumber
            value={formData.heightCm}
            onChange={(val) => setFormData({ ...formData, heightCm: val as any })}
          />
        </Form.FormItem>
        <Form.FormItem label="体重 (kg)">
          <InputNumber
            value={formData.weightKg}
            onChange={(val) => setFormData({ ...formData, weightKg: val as any })}
          />
        </Form.FormItem>
        <Form.FormItem label="收缩压">
          <InputNumber
            value={formData.systolicPressure}
            onChange={(val) =>
              setFormData({ ...formData, systolicPressure: val as any })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="舒张压">
          <InputNumber
            value={formData.diastolicPressure}
            onChange={(val) =>
              setFormData({ ...formData, diastolicPressure: val as any })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="血糖">
          <InputNumber
            value={formData.bloodGlucose}
            onChange={(val) =>
              setFormData({ ...formData, bloodGlucose: val as any })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="血脂">
          <InputNumber
            value={formData.bloodLipid}
            onChange={(val) => setFormData({ ...formData, bloodLipid: val as any })}
          />
        </Form.FormItem>
        <Form.FormItem label="测量时间">
          <DatePicker
            enableTimePicker
            format="YYYY-MM-DD HH:mm"
            value={
              formData.measurementTime
                ? new Date(formData.measurementTime)
                : undefined
            }
            onChange={(val) => {
              if (val) {
                const date = new Date(val as any);
                setFormData({ ...formData, measurementTime: date.getTime() });
              }
            }}
          />
        </Form.FormItem>
      </Form>
    </Dialog>
  );
}