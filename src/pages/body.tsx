import { Button, Card, Dialog, Form, InputNumber, Table, DatePicker, DateRangePicker } from "tdesign-react";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import {BiometricRecordDto, BiometricRecordVo, ResponseResultPageBiometricRecordVo} from "../api";
import { $app } from "../app/app";


const toDateString = (dt: Date) => {
  // 获取时间信息
const year = dt.getFullYear() // 2021
const month = dt.getMonth() // 8
const date = dt.getDate() // 23
// 拼接成字符串
return `${year}-${month + 1}-${date}`
};

export default function BiometricData() {
  const [chartData, setChartData] = useState<any>(null);
  const [records, setRecords] = useState<BiometricRecordVo[]>([]);
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10, total: 0 });
  const [visible, setVisible] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("7d");
  // 设置默认时间范围为最近30天
  const [dateRange, setDateRange] = useState<[string, string]>([
    toDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    toDateString(new Date())
  ]);
  const [formData, setFormData] = useState<BiometricRecordDto>({
    heightCm: 0,
    weightKg: 0,
    systolicPressure: 0,
    diastolicPressure: 0,
    bloodGlucose: 0,
    bloodLipid: 0,
    measurementTime: new Date().getTime(),
  });

  useEffect(() => {
    fetchChartData();
    fetchRecords();
  }, []);

  useEffect(() => {
    if (chartData) {
      const chart = renderChart();
      const handleResize = () => {
        chart?.resize();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart?.dispose();
      };
    }
  }, [chartData]);



  const fetchChartData = async () => {
    const api = $app.$DefaultApi;
    const result = await api.getHealthChart({ timeRange });
    if (result.code === 200) setChartData(result.data);
  };

  const fetchRecords = async (paginationParams = pagination) => {
    const api = $app.$DefaultApi;
    // 使用 Date 对象作为参数
    const result = await api.getHealthRecords({
      startTime: dateRange[0] ?
        dateRange[0] : undefined,
      endTime: dateRange[1] ?
        dateRange[1] : undefined,
      pageNum: paginationParams.pageNum,
      pageSize: paginationParams.pageSize,
    });
    if (result.code === 200) {
      const resultResponseRecord = result as ResponseResultPageBiometricRecordVo;
      setRecords(resultResponseRecord.data?.records || []);
      setPagination({ ...pagination, total: resultResponseRecord.data?.total || 0 });
    }
  };

  const renderChart = (): echarts.ECharts | undefined => {
    const chartDom = document.getElementById("biometric-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: { trigger: "axis" },
        legend: {
          data: ["体重", "收缩压", "舒张压", "血糖", "血脂", "BMI"],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: chartData.dates,
          boundaryGap: false
        },
        yAxis: [
          {
            type: 'value',
            name: '体重/血压',
            position: 'left',
          },
          {
            type: 'value',
            name: '其他指标',
            position: 'right'
          }
        ],
        series: [
          {
            name: "体重",
            data: chartData.weights,
            type: "line",
            yAxisIndex: 0,
            smooth: true
          },
          {
            name: "收缩压",
            data: chartData.systolicPressures,
            type: "line",
            yAxisIndex: 0,
            smooth: true
          },
          {
            name: "舒张压",
            data: chartData.diastolicPressures,
            type: "line",
            yAxisIndex: 0,
            smooth: true
          },
          {
            name: "血糖",
            data: chartData.bloodGlucoses,
            type: "line",
            yAxisIndex: 1,
            smooth: true
          },
          {
            name: "血脂",
            data: chartData.bloodLipids,
            type: "line",
            yAxisIndex: 1,
            smooth: true
          },
          {
            name: "BMI",
            data: chartData.bmis,
            type: "line",
            yAxisIndex: 1,
            smooth: true
          }
        ],
      };
      myChart.setOption(option);
      return myChart;
    }
    return undefined;
  };

  const handleDelete = async (id: number) => {
    const api = $app.$DefaultApi;
    const result = await api.deleteHealthBiometricId({ id });
    if (result.code === 200) await fetchRecords();
  };

  const handleSubmit = async () => {
    const api = $app.$DefaultApi;
    const result = await api.postHealthBiometric({ biometricRecordDto: formData });
    if (result.code === 200) {
      setVisible(false);
      await fetchRecords();
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* 上半部分：ECharts 折线图 */}
      <Card
        title="体征数据趋势"
        actions={
          <div className="flex gap-2">
            <Button
              variant={timeRange === "7d" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("7d");
                fetchChartData();
              }}
            >
              近7天
            </Button>
            <Button
              variant={timeRange === "1m" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("1m");
                fetchChartData();
              }}
            >
              近1月
            </Button>
            <Button
              variant={timeRange === "3m" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("3m");
                fetchChartData();
              }}
            >
              近3月
            </Button>
            <Button
              variant={timeRange === "6m" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("6m");
                fetchChartData();
              }}
            >
              近半年
            </Button>
          </div>
        }
      >
        <div id="biometric-chart" className="w-full h-96"></div>
      </Card>

      {/* 下半部分：分页表格 */}
      <Card title="体征数据记录">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <DateRangePicker
              placeholder={['开始时间', '结束时间']}
              value={dateRange}
              onChange={(val) => {
                if (Array.isArray(val) && val[0] && val[1]) {
                  setDateRange([
                    toDateString(new Date(val[0])),
                    toDateString(new Date(val[1]))
                  ]);
                  fetchRecords();
                }
              }}
            />
          </div>
          <Button theme="primary" onClick={() => setVisible(true)}>新增记录</Button>
        </div>
        <Table
          data={records}
          columns={[
            {
              align: 'center',
              width: 100,
              ellipsis: true,
              title: "身高",
              colKey: "heightCm",
              cell: ({ row }) => `${row.heightCm} cm`
            },
            {
              align: 'center',
              width: 100,
              ellipsis: true,
              title: "体重",
              colKey: "weightKg",
              cell: ({ row }) => `${row.weightKg} kg`
            },
            {
              align: 'center',
              width: 100,
              ellipsis: true,
              title: "收缩压",
              colKey: "systolicPressure",
              cell: ({ row }) => `${row.systolicPressure} mmHg`
            },
            {
              align: 'center',
              width: 100,
              ellipsis: true,
              title: "舒张压",
              colKey: "diastolicPressure",
              cell: ({ row }) => `${row.diastolicPressure} mmHg`
            },
            {
              align: 'center',
              width: 100,
              ellipsis: true,
              title: "血糖",
              colKey: "bloodGlucose",
              cell: ({ row }) => `${row.bloodGlucose} mmol/L`
            },
            {
              align: 'center',
              width: 100,
              ellipsis: true,
              title: "血脂",
              colKey: "bloodLipid",
              cell: ({ row }) => `${row.bloodLipid} mmol/L`
            },
            {
              align: 'center',
              width: 160,
              ellipsis: true,
              title: "测量时间",
              colKey: "measurementTime",
              cell: ({ row }) => {
                const date = row.measurementTime;
                return date?.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                });
              }
            },
            {
              align: 'center',
              width: 100,
              fixed: 'right',
              title: "操作",
              colKey: "action",
              cell: ({ row }) => (
                <Button
                  theme="danger"
                  variant="text"
                  size="small"
                  onClick={() => handleDelete(row.recordId)}
                >
                  删除
                </Button>
              ),
            },
          ]}
          rowKey="id"
          verticalAlign="middle"
          hover
          stripe
          bordered
          loading={false}
          pagination={{
            total: pagination.total,
            current: pagination.pageNum,
            pageSize: pagination.pageSize,
            showJumper: true,
            pageSizeOptions: [5, 10, 20, 50],
            onChange: async (pageInfo) => {
              const newPagination = {
                ...pagination,
                pageNum: pageInfo.current,
                pageSize: pageInfo.pageSize
              };
              setPagination(newPagination);
              await fetchRecords(newPagination);
            },
          }}
        />
      </Card>

      {/* 新增记录对话框 */}
      <Dialog visible={visible} onClose={() => setVisible(false)} header="新增体征数据">
        <Form onSubmit={handleSubmit}>
          <Form.FormItem label="身高 (cm)">
            <InputNumber value={formData.heightCm} onChange={(val) => setFormData({ ...formData, heightCm: val })} />
          </Form.FormItem>
          <Form.FormItem label="体重 (kg)">
            <InputNumber value={formData.weightKg} onChange={(val) => setFormData({ ...formData, weightKg: val })} />
          </Form.FormItem>
          <Form.FormItem label="收缩压">
            <InputNumber value={formData.systolicPressure} onChange={(val) => setFormData({ ...formData, systolicPressure: val })} />
          </Form.FormItem>
          <Form.FormItem label="舒张压">
            <InputNumber value={formData.diastolicPressure} onChange={(val) => setFormData({ ...formData, diastolicPressure: val })} />
          </Form.FormItem>
          <Form.FormItem label="血糖">
            <InputNumber value={formData.bloodGlucose} onChange={(val) => setFormData({ ...formData, bloodGlucose: val })} />
          </Form.FormItem>
          <Form.FormItem label="血脂">
            <InputNumber value={formData.bloodLipid} onChange={(val) => setFormData({ ...formData, bloodLipid: val })} />
          </Form.FormItem>
          <Form.FormItem label="测量时间">
            <DatePicker
              enableTimePicker
              format="YYYY-MM-DD HH:mm:ss"
              value={formData.measurementTime ? new Date(formData.measurementTime) : undefined}
              onChange={(val) => {
                if (val) {
                  const date = new Date(val);
                  setFormData({ ...formData, measurementTime: date.getTime() });
                }
              }}
            />
          </Form.FormItem>
          <Button type="submit">提交</Button>
        </Form>
      </Dialog>
    </div>
  );
}