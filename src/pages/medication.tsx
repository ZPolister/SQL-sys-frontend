import {
  Button,
  Card,
  Table,
  DateRangePicker,
  MessagePlugin,
  Row,
  Col,
  Tag,
} from "tdesign-react";
import { useEffect, useState } from "react";
import { $app } from "../app/app";
import {
  MedicationReminder,
  ResponseResultPageMedicationReminder,
} from "../api";
import MedicationDialog from "./components/Dialogs/MedicationDialog";

const toDateString = (dt: Date) => {
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const date = dt.getDate();
  return `${year}-${month + 1}-${date}`;
};

export default function Medication() {
  const [recentReminders, setRecentReminders] = useState<MedicationReminder[]>([]);
  const [records, setRecords] = useState<MedicationReminder[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 设置默认时间范围为最近30天
  const [dateRange, setDateRange] = useState<[string, string]>([
    toDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    toDateString(new Date()),
  ]);
  const [visible, setVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<MedicationReminder | undefined>(undefined);

  useEffect(() => {
    fetchRecentReminders().finally();
  }, []);

  useEffect(() => {
    fetchRecords().finally();
  }, [dateRange]);

  const fetchRecentReminders = async () => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.getMedicationReminder({
        pageNum: 1,
        pageSize: 4,
      });
      if (result.code === 200) {
        setRecentReminders(result.data?.records || []);
      }
    } catch (error) {
      await MessagePlugin.error("获取最近服药提醒失败");
      console.error(error);
    }
  };

  const fetchRecords = async (paginationParams = pagination) => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.getMedicationReminder({
        startDate: dateRange[0],
        endDate: dateRange[1],
        pageNum: paginationParams.pageNum,
        pageSize: paginationParams.pageSize,
      });
      if (result.code === 200) {
        const resultResponse = result as ResponseResultPageMedicationReminder;
        setRecords(resultResponse.data?.records || []);
        setPagination({
          ...paginationParams,
          total: resultResponse.data?.total || 0,
        });
      }
    } catch (error) {
      await MessagePlugin.error("获取服药记录失败");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const api = $app.$DefaultApi;
    try {
      const result = await api.deleteMedicationReminderReminderId({ reminderId: id });
      if (result.code === 200) {
        await fetchRecords();
        await fetchRecentReminders();
        await MessagePlugin.success(result.msg || "删除提醒成功");
      } else {
        await MessagePlugin.error(result.msg || "删除提醒失败");
      }
    } catch (error) {
      await MessagePlugin.error("删除提醒失败，请检查网络连接");
      console.error(error);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* 上半部分：最近的服药提醒 */}
      <Card title="最近服药提醒">
        { recentReminders.length > 0 ? (
        <Row gutter={[16, 16]}>
          {recentReminders.map((reminder) => (
            <Col key={reminder.reminderId} xs={24} sm={12} md={6}>
              <Card
                bordered
                theme="default"
                className="h-full"
                title={reminder.medicationName}
                actions={
                  <div className="flex gap-2">
                    <Button
                      theme="primary"
                      variant="text"
                      onClick={() => {
                        setCurrentReminder(reminder);
                        setVisible(true);
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      theme="danger"
                      variant="text"
                      onClick={() => handleDelete(reminder.reminderId as number)}
                    >
                      删除
                    </Button>
                  </div>
                }
              >
                <div className="flex flex-col gap-2">
                  <div>剂量：{reminder.medicationDosage}</div>
                  <div>频率：每日 {reminder.medicationFrequency} 次</div>
                  <div>提醒时间：{
                    (() => {
                      try {
                        const times = JSON.parse(reminder.reminderTime || "[]");
                        return Array.isArray(times) ? times.join(", ") : times;
                      } catch (e) {
                        return reminder.reminderTime;
                      }
                    })()
                  }</div>
                  <div>下次服用时间：{reminder.nextReminderTime ? new Date(reminder.nextReminderTime).toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }) : "未设置"}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>) : (
          <div className="text-center py-8">
            <p className="text-xl mb-6" style={{color: 'var(--td-text-color-secondary)'}}>最近不用吃药噢，不用吃药身体倍儿棒~</p>
          </div>
        )}
      </Card>

      {/* 下半部分：分页表格 */}
      <Card title="服药记录">
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
                }
              }}
            />
          </div>
          <Button theme="primary" onClick={() => {
            setCurrentReminder(undefined);
            setVisible(true);
          }}>
            新增提醒
          </Button>
        </div>
        <Table
          data={records}
          columns={[
            {
              align: "left",
              width: 150,
              ellipsis: true,
              title: "药品名称",
              colKey: "medicationName",
            },
            {
              align: "center",
              width: 160,
              ellipsis: true,
              title: "剂量",
              colKey: "medicationDosage",
            },
            {
              align: "center",
              width: 50,
              ellipsis: true,
              title: "服用频率",
              colKey: "medicationFrequency",
            },
            {
              align: "center",
              width: 130,
              ellipsis: true,
              title: "下次服药时间",
              colKey: "nextReminderTime",
              cell: ({ row }) => {
                const date = new Date(row.nextReminderTime);
                return date.toLocaleString("zh-CN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              },
            },
            {
              align: "center",
              width: 200,
              ellipsis: true,
              title: "提醒时间",
              colKey: "reminderTime",
              cell: ({ row }) => {
                try {
                  const times = JSON.parse(row.reminderTime || "[]");
                  return Array.isArray(times) ? times.join(", ") : times;
                } catch (e) {
                  return row.reminderTime;
                }
              }
            },
            {
              align: "center",
              width: 60,
              ellipsis: true,
              title: "已服用次数",
              colKey: "reminderCount",
            },
            {
              align: "center",
              width: 80,
              ellipsis: true,
              title: "状态",
              colKey: "status",
              cell: ({ row }) => <Tag theme={row.completionStatus == 0 ? "warning" : "success"}>
                {row.completionStatus == 0 ? "正在服用" : "已完成服用"}
              </Tag>,
            },
            {
              align: "center",
              width: 100,
              fixed: "right",
              title: "操作",
              colKey: "action",
              cell: ({ row }) => (
                <div className="flex gap-2 justify-center">
                  <Button
                    theme="primary"
                    variant="text"
                    size="small"
                    onClick={() => {
                      setCurrentReminder(row as MedicationReminder);
                      setVisible(true);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    theme="danger"
                    variant="text"
                    size="small"
                    onClick={() => handleDelete(row.reminderId as number)}
                  >
                    删除
                  </Button>
                </div>
              ),
            },
          ]}
          rowKey="reminderId"
          verticalAlign="middle"
          hover
          stripe
          bordered
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
                pageSize: pageInfo.pageSize,
              };
              setPagination(newPagination);
              await fetchRecords(newPagination);
            },
          }}
        />
      </Card>

      {/* 服药提醒对话框组件 */}
      <MedicationDialog
        visible={visible}
        initialData={currentReminder}
        onClose={() => {
          setVisible(false);
          setCurrentReminder(undefined);
        }}
        onSuccess={() => {
          fetchRecords().finally();
          fetchRecentReminders().finally();
        }}
      />
    </div>
  );
}