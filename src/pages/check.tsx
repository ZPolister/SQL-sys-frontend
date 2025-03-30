import {
  Button,
  Card,
  Table,
  DateRangePicker,
  MessagePlugin,
  Popconfirm,
  Space,
  Statistic,
  Row,
  Col,
} from "tdesign-react";
import { useEffect, useState } from "react";
import { $app } from "../app/app";
import {
  HealthCheckReminderDto,
  ResponseResultPageHealthCheckReminder,
  HealthCheckReminder,
} from "../api";
import HealthCheckDialog from "./components/Dialogs/HealthCheckDialog";
import { CalendarIcon, DeleteIcon, EditIcon } from "tdesign-icons-react";

const toDateString = (dt: Date) => {
  // 获取时间信息
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const date = dt.getDate();
  // 拼接成字符串
  return `${year}-${month + 1}-${date}`;
};

export default function Check() {
  const [latestReminder, setLatestReminder] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [editId, setEditID] = useState<number | null>();
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  const [visible, setVisible] = useState(false);
  const [editData, setEditData] = useState<HealthCheckReminderDto | null>(null);
  // 设置默认时间范围为今天到一年后
  const [dateRange, setDateRange] = useState<[string, string]>([
    toDateString(new Date()),
    toDateString(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
  ]);

  useEffect(() => {
    fetchLatestReminder().finally();
  }, []);

  useEffect(() => {
    fetchRecords().finally();
  }, [pagination.pageNum, pagination.pageSize]);

  const fetchLatestReminder = async () => {
    try {
      const api = $app.$DefaultApi;
      // 获取最近的一条体检提醒
      const result = await api.getHealthCheckReminderList({
        pageNum: 1,
        pageSize: 1,
      });
      if (result.code === 200 && result.data?.records?.length) {
        setLatestReminder(result.data.records[0]);
      }
    } catch (error) {
      console.error("获取最新体检提醒失败", error);
      await MessagePlugin.error("获取最新体检提醒失败");
    }
  };

  const fetchRecords = async (paginationParams = pagination) => {
    try {
      const api = $app.$DefaultApi;
      const result = (await api.getHealthCheckReminderList({
        startDate: dateRange[0],
        endDate: dateRange[1],
        pageNum: paginationParams.pageNum,
        pageSize: paginationParams.pageSize,
      })) as ResponseResultPageHealthCheckReminder;

      if (result.code === 200) {
        setRecords(result.data?.records || []);
        setPagination({
          ...paginationParams,
          total: result.data?.total || 0,
        });
      }
    } catch (error) {
      console.error("获取体检提醒列表失败", error);
      await MessagePlugin.error("获取体检提醒列表失败");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const api = $app.$DefaultApi;
      const result = await api.deleteHealthCheckReminderReminderId({
        reminderId: id,
      });
      if (result.code === 200) {
        await MessagePlugin.success("删除成功");
        await fetchRecords();
        await fetchLatestReminder();
      }
    } catch (error) {
      console.error("删除失败", error);
      await MessagePlugin.error("删除失败");
    }
  };

  const handleEdit = (record: any) => {
    setEditData({
      checkFrequencyDays: record.checkFrequencyDays,
      scheduledTime: new Date(record.scheduledTime),
      reminderContent: record.reminderContent,
    });
    setEditID(record.reminderId);
    setVisible(true);
  };

  const columns = [
    {
      title: "提醒内容",
      colKey: "reminderContent",
    },
    {
      title: "体检频率(天)",
      colKey: "checkFrequencyDays",
    },
    {
      title: "计划体检时间",
      colKey: "scheduledTime",
      cell: ({ row }: any) => {
        const date = new Date(row.scheduledTime);
        return date.toLocaleDateString();
      },
    },
    {
      title: "操作",
      colKey: "operation",
      // fixed: "right" as "right",
      // width: 120,
      cell: ({ row }: any) => (
        <Space>
          <Button
            theme="primary"
            variant="text"
            onClick={() => handleEdit(row)}
            icon={<EditIcon />}
          >
            编辑
          </Button>
          <Popconfirm
            content="确认删除该记录吗？"
            onConfirm={() => handleDelete(row.reminderId)}
          >
            <Button theme="danger" variant="text" icon={<DeleteIcon />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {/*<h1 className="text-2xl font-bold mb-6">体检提醒管理</h1>*/}

      {/* 最近体检提醒卡片 */}
      <Card
        title="最近体检提醒"
        actions={
          <Button theme="primary" icon={<CalendarIcon />} onClick={() => {
            setEditID(null);
            setVisible(true);
          }}>
            新增体检提醒
          </Button>
        }
        className="mb-6"
      >
        {latestReminder ? (
          <Row gutter={[16, 16]}> 
            <Col span={8}> 
              <Statistic
                title="提醒内容"
                value={latestReminder.reminderContent}
              />
            </Col>
            <Col span={8}> 
              <Statistic
                title="计划体检时间"
                value={new Date(latestReminder.scheduledTime).toLocaleDateString() as any}
              />
            </Col>
            <Col span={8}> 
              <Statistic
                title="体检频率"
                value={`${latestReminder.checkFrequencyDays} 天` as any}
              />
            </Col>
          </Row>
        ) : (
          <div className="p-4 text-center text-gray-500">
            暂无体检提醒，请点击右上角添加
          </div>
        )}
      </Card>

      {/* 体检提醒列表 */}
      <Card
        title="体检提醒列表"
        actions={
          <div className="flex items-center">
            <DateRangePicker
              value={dateRange}
              onChange={(value) => {
                if (Array.isArray(value) && value.length === 2) {
                  setDateRange([toDateString(new Date(value[0])), 
                                toDateString(new Date(value[1]))]);
                }
              }}
              mode="date"
              placeholder={["开始日期", "结束日期"]}
              className="mr-4"
            />
            <Button
              theme="primary"
              onClick={() => fetchRecords()}
            >
              查询
            </Button>
          </div>
        }
      >
        <Table
          data={records}
          columns={columns}
          rowKey="reminderId"
          pagination={{
            current: pagination.pageNum,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showJumper: true,
            onChange(pageInfo) {
              setPagination({
                ...pagination,
                pageNum: pageInfo.current,
                pageSize: pageInfo.pageSize,
              });
            },
          }}
        />
      </Card>

      {/* 新增/编辑对话框 */}
      <HealthCheckDialog
        visible={visible}
        editData={editData}
        reminderId={editId}
        onClose={() => {
          setVisible(false);
          setEditData(null);
          setEditID(null);
        }}
        onSuccess={() => {
          setVisible(false);
          setEditID(null);
          setEditData(null);
          fetchRecords().finally();
          fetchLatestReminder().finally();
        }}
      />
    </div>
  );
}