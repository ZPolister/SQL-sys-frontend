import {
  Button,
  Card,
  Table,
  DateRangePicker,
  Select,
} from "tdesign-react";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import { SleepLogDto, ResponseResultPageSleepLog } from "../api";
import { $app } from "../app/app";
import { MessagePlugin } from "tdesign-react";
import SleepDialog from "./components/Dialogs/SleepDialog";

const toDateString = (dt: Date) => {
  // 获取时间信息
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const date = dt.getDate();
  // 拼接成字符串
  return `${year}-${month + 1}-${date}`;
};

export default function Sleep() {
  const [chartData, setChartData] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  const [visible, setVisible] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("week");
  // 设置默认时间范围为最近30天
  const [dateRange, setDateRange] = useState<[string, string]>([
    toDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    toDateString(new Date()),
  ]);
  const [formData, setFormData] = useState<SleepLogDto>({
    sleepStart: new Date(),
    sleepEnd: new Date(),
    sleepQuality: 3,
  });

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (chartData) {
      const chart = renderChart();
      const handleResize = () => {
        chart?.resize();
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart?.dispose();
      };
    }
  }, [chartData]);

  const fetchChartData = async () => {
    const api = $app.$DefaultApi;
    const result = await api.getSleepDuration({ range: timeRange });
    if (result.code === 200) setChartData(result.data);
  };

  const fetchRecords = async (paginationParams = pagination) => {
    const api = $app.$DefaultApi;
    const result = (await api.getSleepPage({
      startDate: dateRange[0],
      endDate: dateRange[1],
      pageNum: paginationParams.pageNum,
      pageSize: paginationParams.pageSize,
    })) as ResponseResultPageSleepLog;
    if (result.code === 200) {
      setRecords(result.data?.records || []);
      setPagination({
        ...paginationParams,
        total: result.data?.total || 0,
      });
    }
  };

  const renderChart = (): echarts.ECharts | undefined => {
    const chartDom = document.getElementById("sleep-chart");
    if (chartDom && chartData) {
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: { trigger: "axis" },
        legend: {
          data: ["睡眠时长"],
          bottom: 0,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: chartData.dates,
          boundaryGap: true,
        },
        yAxis: {
          type: "value",
          name: "睡眠时长(小时)",
        },
        series: [
          {
            name: "睡眠时长",
            data: chartData.durations,
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#6b7ddf",
            },
          },
        ],
      };
      myChart.setOption(option);
      return myChart;
    }
    return undefined;
  };

  const handleDelete = async (id: number) => {
    const api = $app.$DefaultApi;
    const result = await api.deleteSleepLogId({ logId: id });
    if (result.code === 200) await fetchRecords();
  };

  const handleSuccess = async () => {
    await fetchRecords();
    await fetchChartData();
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* 上半部分：ECharts 折线图 */}
      <Card
        title="每日睡眠时长趋势"
        actions={
          <div className="flex gap-2">
            <Button
              variant={timeRange === "week" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("week");
              }}
            >
              近一周
            </Button>
            <Button
              variant={timeRange === "month" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("month");
              }}
            >
              近一月
            </Button>
            <Button
              variant={timeRange === "3months" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("3months");
              }}
            >
              近三月
            </Button>
            <Button
              variant={timeRange === "6months" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("6months");
              }}
            >
              近半年
            </Button>
          </div>
        }
      >
        <div id="sleep-chart" className="w-full h-96"></div>
      </Card>

      {/* 下半部分：分页表格 */}
      <Card title="睡眠记录">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <DateRangePicker
              placeholder={["开始时间", "结束时间"]}
              value={dateRange}
              onChange={(val) => {
                if (Array.isArray(val) && val[0] && val[1]) {
                  setDateRange([
                    toDateString(new Date(val[0])),
                    toDateString(new Date(val[1])),
                  ]);
                  fetchRecords();
                }
              }}
            />
          </div>
          <Button theme="primary" onClick={() => setVisible(true)}>
            新增记录
          </Button>
        </div>
        <Table
          data={records}
          columns={[
            {
              align: "center",
              width: 160,
              ellipsis: true,
              title: "入睡时间",
              colKey: "sleepStart",
              cell: ({ row }) => {
                const date = row.sleepStart ? new Date(row.sleepStart) : null;
                return date?.toLocaleString();
              },
            },
            {
              align: "center",
              width: 160,
              ellipsis: true,
              title: "醒来时间",
              colKey: "sleepEnd",
              cell: ({ row }) => {
                const date = row.sleepEnd ? new Date(row.sleepEnd) : null;
                return date?.toLocaleString();
              },
            },
            {
              align: "center",
              width: 100,
              ellipsis: true,
              title: "睡眠质量",
              colKey: "sleepQuality",
              cell: ({ row }) => `${row.sleepQuality || "-"} 级`,
            },
            {
              align: "center",
              width: 100,
              fixed: "right",
              title: "操作",
              colKey: "action",
              cell: ({ row }) => (
                <Button
                  theme="danger"
                  variant="text"
                  size="small"
                  onClick={() => handleDelete(row.logId)}
                >
                  删除
                </Button>
              ),
            },
          ]}
          rowKey="logId"
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
            onPageSizeChange: (size) => {
              const newPagination = {
                ...pagination,
                pageSize: size,
                pageNum: 1,
              };
              setPagination(newPagination);
              fetchRecords(newPagination);
            },
            onChange: async (pageInfo) => {
              const newPagination = {
                ...pagination,
                pageNum: pageInfo.current,
                pageSize: pageInfo.pageSize,
              };
              setPagination(newPagination);
              await fetchRecords(newPagination);
            },
          }}
        />
      </Card>

      {/* 使用解耦的睡眠记录对话框组件 */}
      <SleepDialog
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}