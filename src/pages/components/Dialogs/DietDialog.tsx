import { Dialog, Form, InputNumber, DatePicker, Input, MessagePlugin } from "tdesign-react";
import { useState, useEffect } from "react";
import {DietLogDto, ResponseResult} from "../../../api";
import { $app } from "../../../app/app";

interface DietDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DietDialog({ visible, onClose, onSuccess }: DietDialogProps) {
  const [formData, setFormData] = useState<DietLogDto>({
    foodItem: "",
    quantityGrams: 0,
    totalCalories: 0,
    consumptionTime: new Date().getTime(),
  });

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      setFormData({
        foodItem: "",
        quantityGrams: 0,
        totalCalories: 0,
        consumptionTime: new Date().getTime(),
      });
    }
  }, [visible]);

  const handleSubmit = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.postDiet({ dietLogDto: formData }) as ResponseResult;
      if (result.code === 200) {
        await MessagePlugin.success(result.msg || "添加饮食记录成功");
        onClose();
        onSuccess();
      } else {
        await MessagePlugin.error(result.msg || "添加饮食记录失败");
      }
    } catch (error) {
      await MessagePlugin.error("添加饮食记录失败，请检查网络连接");
      console.error(error);
    }
  };

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      header="新增饮食记录"
      confirmBtn="提交"
      onConfirm={handleSubmit}
    >
      <Form>
        <Form.FormItem label="食物名称">
          <Input
            value={formData.foodItem}
            onChange={(val) => setFormData({ ...formData, foodItem: val })}
          />
        </Form.FormItem>
        <Form.FormItem label="数量 (克)">
          <InputNumber
            value={formData.quantityGrams}
            onChange={(val) =>
              setFormData({ ...formData, quantityGrams: val })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="热量 (千卡)">
          <InputNumber
            value={formData.totalCalories}
            onChange={(val) =>
              setFormData({ ...formData, totalCalories: val })
            }
          />
        </Form.FormItem>
        <Form.FormItem label="食用时间">
          <DatePicker
            enableTimePicker
            format="YYYY-MM-DD HH:mm:ss"
            value={
              formData.consumptionTime
                ? new Date(formData.consumptionTime)
                : undefined
            }
            onChange={(val) => {
              if (val) {
                const date = new Date(val);
                setFormData({ ...formData, consumptionTime: date.getTime() });
              }
            }}
          />
        </Form.FormItem>
      </Form>
    </Dialog>
  );
}