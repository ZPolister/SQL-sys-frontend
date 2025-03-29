import {
  Button,
  Card,
  Table,
  DateRangePicker,
  Select,
} from "tdesign-react";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import {DietLogDto, ResponseResult, ResponseResultPageDietLog} from "../api";
import { $app } from "../app/app";
import { MessagePlugin } from "tdesign-react";
import DietDialog from "./components/Dialogs/DietDialog";

const toDateString = (dt: Date) => {
  // 获取时间信息
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const date = dt.getDate();
  // 拼接成字符串
  return `${year}-${month + 1}-${date}`;
};

export default function Nutrition() {
  const [chartData, setChartData] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  const [visible, setVisible] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("WEEK");
  // 设置默认时间范围为最近30天
  const [dateRange, setDateRange] = useState<[string, string]>([
    toDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    toDateString(new Date()),
  ]);
  const [formData, setFormData] = useState<DietLogDto>({
    foodItem: "",
    quantityGrams: 0,
    totalCalories: 0,
    consumptionTime: new Date().getTime(),
  });

  useEffect(() => {
    fetchChartData().finally();
  }, [timeRange]);

  useEffect(() => {
    fetchRecords().finally();
  }, [dateRange]);

  useEffect(() => {
    if (!chartData) return;

    // 获取或创建图表实例
    const chart = renderChart();
    if (!chart) return;

    // 处理窗口大小变化
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    // 处理主题变化
    const removeThemeListener = $app.addThemeChangeListener((isDark) => {
      console.log("主题变化，当前是否深色:", isDark);
      chart.dispose();
      renderChart();
    });

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      removeThemeListener();
      chart.dispose();
    };
  }, [chartData]);

  const fetchChartData = async () => {
    const api = $app.$DefaultApi;
    const result = await api.getDietDailyCalories({ range: timeRange });
    if (result.code === 200) setChartData(result.data);
  };

  const fetchRecords = async (paginationParams = pagination) => {
    const api = $app.$DefaultApi;
    const result = (await api.getDietPage({
      startDate: dateRange[0],
      endDate: dateRange[1],
      pageNum: paginationParams.pageNum,
      pageSize: paginationParams.pageSize,
    })) as ResponseResultPageDietLog;
    if (result.code === 200) {
      const resultResponseRecord = result as ResponseResultPageDietLog;
      setRecords(resultResponseRecord.data?.records || []);
      setPagination({
        ...paginationParams,
        total: resultResponseRecord.data?.total || 0,
      });
    }
  };

  const renderChart = (): echarts.ECharts | undefined => {
    const chartDom = document.getElementById("nutrition-chart");
    if (chartDom && chartData) {
      // 确保在初始化新图表之前清理掉旧的图表实例
      const existingChart = echarts.getInstanceByDom(chartDom);
      if (existingChart) {
        existingChart.dispose();
      }
      const myChart = echarts.init(chartDom, $app.$isDarkTheme ? "dark" : "light");
      const option = {
        backgroundColor: "",
        tooltip: { trigger: "axis" },
        legend: {
          data: ["每日热量"],
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
          name: "热量(千卡)",
        },
        series: [
          {
            name: "每日热量",
            data: chartData.calories,
            type: "bar",
            smooth: true,
            itemStyle: {
              color: "#91cc75",
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
    const result = await api.deleteDietLogId({ logId: id });
    if (result.code === 200) await fetchRecords();
  };

  const handleSuccess = async () => {
    await fetchRecords();
    await fetchChartData();
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* 上半部分：ECharts 条形图 */}
      <Card
        title="每日饮食热量趋势"
        actions={
          <div className="flex gap-2">
            <Button
              variant={timeRange === "WEEK" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("WEEK");
              }}
            >
              近一周
            </Button>
            <Button
              variant={timeRange === "MONTH" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("MONTH");
              }}
            >
              近一月
            </Button>
            <Button
              variant={timeRange === "THREE_MONTHS" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("THREE_MONTHS");
              }}
            >
              近三月
            </Button>
            <Button
              variant={timeRange === "HALF_YEAR" ? "base" : "outline"}
              onClick={() => {
                setTimeRange("HALF_YEAR");
              }}
            >
              近半年
            </Button>
          </div>
        }
      >
        <div id="nutrition-chart" className="w-full h-96"></div>
      </Card>

      {/* 下半部分：分页表格 */}
      <Card title="饮食记录">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Button theme="success" onClick={() => {
              downloadExportExcel();
            }}>
              导出Excel
            </Button>
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
              width: 150,
              ellipsis: true,
              title: "食物名称",
              colKey: "foodItem",
            },
            {
              align: "center",
              width: 100,
              ellipsis: true,
              title: "数量",
              colKey: "quantityGrams",
              cell: ({ row }) => `${row.quantityGrams} 克`,
            },
            {
              align: "center",
              width: 100,
              ellipsis: true,
              title: "热量",
              colKey: "totalCalories",
              cell: ({ row }) => `${row.totalCalories} 千卡`,
            },
            {
              align: "center",
              width: 160,
              ellipsis: true,
              title: "食用时间",
              colKey: "consumptionTime",
              cell: ({ row }) => {
                const date = row.consumptionTime
                  ? new Date(row.consumptionTime)
                  : null;
                return date?.toLocaleString();
              },
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

      {/* 使用解耦的饮食记录对话框组件 */}
      <DietDialog
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

// 新增导出Excel函数
const downloadExportExcel = async () => {
  try {
    const api = $app.$DefaultApi;
    const response = await api.getExportDiet() as any; // 假设后端有导出接口
    if (response && response.type === 'blob') {
      const url = URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'diet_records.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    await MessagePlugin.error('导出失败，请重试');
  }
};
