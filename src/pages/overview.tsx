import {Button, Card, Row, Col, Tag, Statistic} from "tdesign-react";
import {AddIcon} from "tdesign-icons-react";
import {useEffect, useState} from "react";
import {
    BiometricRecordDto,
    ExerciseLogDto,
    SleepLogDto,
    HealthCheckReminderDto,
    ResponseResult, BiometricRecordVo
} from "../api";
import {$app} from "../app/app";

const DataCard = ({title}: { title: string }) => {
  return (
    <Card
      title={title}
      actions={(
        <Button theme="primary" variant="text" icon={<AddIcon/>}>
          添加记录
        </Button>
      )}
    >
      <div className={"w-full h-64 flex flex-row items-center justify-center"}>
        <div>EChart图表</div>
      </div>
    </Card>
  )
}

export default function Overview() {
  const [biometricData, setBiometricData] = useState<BiometricRecordVo | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseLogDto | null>(null);
  const [dietCalories, setDietCalories] = useState<number>(0);
  const [sleepData, setSleepData] = useState<SleepLogDto | null>(null);
  const [healthCheckReminder, setHealthCheckReminder] = useState<HealthCheckReminderDto | null>(null);

  useEffect(() => {
      const api = $app.$DefaultApi;

    // 获取所有数据
    const fetchData = async () => {
      try {
        const [
          biometricResult,
          exerciseResult,
          dietResult,
          sleepResult,
          reminderResult
        ] = await Promise.all([
          api.getHealthLatestRaw(),
          api.getExerciseLatest(),
          api.getDietHotToday(),
          api.getSleepLatest(),
          api.getHealthCheckReminder()
        ]);

        // 解构API响应
        const biometricResponse = biometricResult as ResponseResult;
        const exerciseResponse = exerciseResult as ResponseResult;
        const dietResponse = dietResult as ResponseResult;
        const sleepResponse = sleepResult as ResponseResult;
        const reminderResponse = reminderResult as ResponseResult;

        if (biometricResponse.code === 200 && biometricResponse.data) {
          setBiometricData(biometricResponse.data as BiometricRecordVo);
        }

        if (exerciseResponse.code === 200 && exerciseResponse.data) {
          setExerciseData(exerciseResponse.data as ExerciseLogDto);
        }

        if (dietResponse.code === 200 && dietResponse.data !== undefined) {
          setDietCalories(dietResponse.data as number);
        }

        if (sleepResponse.code === 200 && sleepResponse.data) {
          setSleepData(sleepResponse.data as SleepLogDto);
        }

        if (reminderResponse.code === 200 && reminderResponse.data) {
          setHealthCheckReminder(reminderResponse.data as HealthCheckReminderDto);
        }
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={"p-6 flex flex-col gap-5"}>
      <Card
        title={"健康体检提醒"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>}>
            设置提醒
          </Button>
        )}
      >
        <div className={"w-full flex flex-row items-center justify-between p-4"}>
          {healthCheckReminder && (
            <>
              <Statistic
                title="下次体检时间"
                value={healthCheckReminder.scheduledTime}
              />
              <Statistic
                title="检查周期"
                value={healthCheckReminder.checkFrequencyDays}
                unit="天"
              />
              <div>
                <div className="text-sm text-gray-500 mb-1">提醒内容</div>
                <div>{healthCheckReminder.reminderContent}</div>
              </div>
            </>
          )}
        </div>
      </Card>

      <Card
        title={"体征数据"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>}>
            添加记录
          </Button>
        )}
      >
        {biometricData && (
          <div className={"w-full flex flex-col gap-4 p-4"}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic title="BMI" value={biometricData.bmi?.toFixed(1)} />
                <Tag theme={biometricData.bmiLevel === "正常" ? "success" : "warning"} className="mt-2">
                  {biometricData.bmiLevel}
                </Tag>
              </Col>
              <Col span={6}>
                <Statistic
                  title="血压"
                  value={`${biometricData.systolicPressure}/${biometricData.diastolicPressure}`}
                  unit="mmHg"
                />
                <Tag theme={biometricData.bloodPressureLevel === "正常" ? "success" : "warning"} className="mt-2">
                  {biometricData.bloodPressureLevel}
                </Tag>
              </Col>
              <Col span={6}>
                <Statistic title="血糖" value={biometricData.bloodGlucose} unit="mmol/L" />
                <Tag theme={biometricData.bloodGlucoseLevel === "正常" ? "success" : "warning"} className="mt-2">
                  {biometricData.bloodGlucoseLevel}
                </Tag>
              </Col>
              <Col span={6}>
                <Statistic title="血脂" value={biometricData.bloodLipid} unit="mmol/L" />
                <Tag theme={biometricData.bloodLipidLevel === "正常" ? "success" : "warning"} className="mt-2">
                  {biometricData.bloodLipidLevel}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      <Card
        title={"运动数据"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>}>
            添加记录
          </Button>
        )}
      >
        {exerciseData && (
          <div className={"w-full flex flex-row items-center justify-between p-4"}>
            <Statistic title="运动类型" value={exerciseData.exerciseType} />
            <Statistic title="运动时长" value={exerciseData.durationMinutes} unit="分钟" />
            <Statistic title="消耗热量" value={exerciseData.caloriesBurned} unit="千卡" />
            <div className="text-sm text-gray-500">
              开始时间：{new Date(exerciseData.startTimestamp).toLocaleString()}
            </div>
          </div>
        )}
      </Card>

      <Card
        title={"饮食数据"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>}>
            添加记录
          </Button>
        )}
      >
        <div className={"w-full flex flex-row items-center justify-center p-4"}>
          <Statistic title="今日摄入热量" value={dietCalories} unit="千卡" />
        </div>
      </Card>

      <Card
        title={"睡眠数据"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>}>
            添加记录
          </Button>
        )}
      >
        {sleepData && (
          <div className={"w-full flex flex-row items-center justify-between p-4"}>
            <div>
              <div className="text-sm text-gray-500 mb-1">入睡时间</div>
              <div>{new Date(sleepData.sleepStart).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">醒来时间</div>
              <div>{new Date(sleepData.sleepEnd).toLocaleString()}</div>
            </div>
            <Statistic
              title="睡眠质量"
              value={sleepData.sleepQuality}
              suffix={`/5`}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
