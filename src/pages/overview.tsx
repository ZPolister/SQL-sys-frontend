import {Button, Card, Row, Col, Tag, Statistic} from "tdesign-react";
import {AddIcon} from "tdesign-icons-react";
import {useEffect, useState} from "react";
import BiometricDialog from "./components/Dialogs/BiometricDialog";
import DietDialog from "./components/Dialogs/DietDialog";
import ExerciseDialog from "./components/Dialogs/ExerciseDialog";
import SleepDialog from "./components/Dialogs/SleepDialog";
import {
    BiometricRecordDto,
    ExerciseLogDto,
    SleepLogDto,
    HealthCheckReminderDto,
    ResponseResult,
    BiometricRecordVo,
    HealthGoal
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
  // 对话框显示状态
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [showDietDialog, setShowDietDialog] = useState(false);
  const [showSleepDialog, setShowSleepDialog] = useState(false);

  const [biometricData, setBiometricData] = useState<BiometricRecordVo | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseLogDto | null>(null);
  const [dietCalories, setDietCalories] = useState<number>(0);
  const [sleepData, setSleepData] = useState<SleepLogDto | null>(null);
  const [healthCheckReminder, setHealthCheckReminder] = useState<HealthCheckReminderDto | null>(null);
  const [healthGoal, setHealthGoal] = useState<HealthGoal | null>(null);

  // 健康目标类别映射
  const goalCategoryMap: Record<string, string> = {
    'WEIGHT_LOSS': '控制体重',
    'BLOOD_LIPID': '控制血脂',
    'BLOOD_SUGAR': '控制血糖',
    'EXERCISE_CALORIES': '热量目标'
  };

  // 目标状态映射
  const goalStatusMap: Record<number, { text: string; theme: 'success' | 'warning' | 'default' }> = {
    0: { text: '进行中', theme: 'default' },
    1: { text: '已达成', theme: 'success' },
    2: { text: '未达成', theme: 'warning' }
  };

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
          reminderResult,
          goalResult
        ] = await Promise.all([
          api.getHealthLatest(),
          api.getExerciseLatest(),
          api.getDietHotToday(),
          api.getSleepLatest(),
          api.getHealthCheckReminder(),
          api.getHealthGoalsCurrent()
        ]);

        // 解构API响应
        const biometricResponse = biometricResult as ResponseResult;
        const exerciseResponse = exerciseResult as ResponseResult;
        const dietResponse = dietResult as ResponseResult;
        const sleepResponse = sleepResult as ResponseResult;
        const reminderResponse = reminderResult as ResponseResult;
        const goalResponse = goalResult as ResponseResult
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

        if (goalResponse.code === 200 && goalResponse.data) {
          setHealthGoal(goalResponse.data as HealthGoal);
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
        title={"体征数据"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>} onClick={() => setShowBiometricDialog(true)}>
            添加记录
          </Button>
        )}
      >
        {biometricData && (
    <div className={"w-full flex flex-col gap-4 p-4"}>
      <Row gutter={[16, 16]} className="">
        <Col span={6}>
          <Statistic title="身高" value={biometricData.heightCm} unit="cm" />
        </Col>
        <Col span={6}>
          <Statistic title="体重" value={biometricData.weightKg} unit="kg" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic title="BMI" value={biometricData.bmi?.toFixed(1)} />
          <Tag theme={biometricData.bmiLevel === "正常" ? "success" : "warning"} className="ml-2 mt-2">
            {biometricData.bmiLevel}
          </Tag>
        </Col>
              <Col span={6}>
                <Statistic
                  title="血压"
                  value={`${biometricData.systolicPressure}/${biometricData.diastolicPressure}`}
                  unit="mmHg"
                />
                <Tag theme={biometricData.bloodPressureLevel === "正常" ? "success" : "warning"} className="ml-2 mt-2">
                  {biometricData.bloodPressureLevel}
                </Tag>
              </Col>
              <Col span={6}>
                <Statistic title="血糖" value={biometricData.bloodGlucose} unit="mmol/L" />
                <Tag theme={biometricData.bloodGlucoseLevel === "正常" ? "success" : "warning"} className="ml-2 mt-2">
                  {biometricData.bloodGlucoseLevel}
                </Tag>
              </Col>
              <Col span={6}>
                <Statistic title="血脂" value={biometricData.bloodLipid} unit="mmol/L" />
                <Tag theme={biometricData.bloodLipidLevel === "正常" ? "success" : "warning"} className="ml-2 mt-2">
                  {biometricData.bloodLipidLevel}
                </Tag>
              </Col>
              <Col span={12}>
                <div className="text-sm text-gray-500">
                  测量时间：{new Date(biometricData.measurementTime).toLocaleString()}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      <Card
        title={"运动数据"}
        actions={(
          <Button theme="primary" variant="text" icon={<AddIcon/>} onClick={() => setShowExerciseDialog(true)}>
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
          <Button theme="primary" variant="text" icon={<AddIcon/>} onClick={() => setShowDietDialog(true)}>
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
          <Button theme="primary" variant="text" icon={<AddIcon/>} onClick={() => setShowSleepDialog(true)}>
            添加记录
          </Button>
        )}
      >
        {sleepData && (
          <div className={"text-xl w-full flex flex-row items-center justify-between p-8"}>
            <div>
              <div className="text-gray-500 mb-1">入睡时间</div>
              <div>{new Date(sleepData.sleepStart).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">醒来时间</div>
              <div>{new Date(sleepData.sleepEnd).toLocaleString()}</div>
            </div>
            <Statistic
              title="睡眠质量"
              value={sleepData.sleepQuality}
              suffix={`/5`}
              className="text-l"
            />
          </div>
        )}
      </Card>

      {healthGoal && (
        <Card
          title={"健康目标"}
          actions={(
            <Button theme="primary" variant="text" icon={<AddIcon/>}>
              设置目标
            </Button>
          )}
        >
          <div className={"w-full flex flex-row items-center justify-between p-4"}>
            <div>
              <div className="text-sm text-gray-500 mb-2">{goalCategoryMap[healthGoal.goalCategory]}</div>
              <Statistic
                title="目标值"
                value={healthGoal.targetValue}
                unit={healthGoal.goalCategory === 'EXERCISE_CALORIES' ? '千卡' :
                      healthGoal.goalCategory === 'WEIGHT_LOSS' ? 'kg' : 'mmol/L'}
              />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">当前进度</div>
              <Statistic
                title="当前值"
                value={healthGoal.currentValue}
                unit={healthGoal.goalCategory === 'EXERCISE_CALORIES' ? '千卡' :
                      healthGoal.goalCategory === 'WEIGHT_LOSS' ? 'kg' : 'mmol/L'}
              />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">目标日期</div>
              <div>{new Date(healthGoal.targetDate).toLocaleDateString()}</div>
              <Tag theme={goalStatusMap[healthGoal.goalStatus].theme} className="mt-2">
                {goalStatusMap[healthGoal.goalStatus].text}
              </Tag>
            </div>
          </div>
        </Card>
      )}

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

      {/* 对话框组件 */}
      <BiometricDialog
        visible={showBiometricDialog}
        onClose={() => setShowBiometricDialog(false)}
        onSuccess={() => {
          // 刷新数据
          $app.$DefaultApi.getHealthLatest().then((res: any) => {
            if (res.code === 200 && res.data) {
              setBiometricData(res.data);
            }
          });
        }}
      />

      <ExerciseDialog
        visible={showExerciseDialog}
        onClose={() => setShowExerciseDialog(false)}
        onSuccess={() => {
          setShowExerciseDialog(false);
          // 刷新数据
          $app.$DefaultApi.getExerciseLatest().then((res: any) => {
            if (res.code === 200 && res.data) {
              setExerciseData(res.data);
            }
          });
        }}
      />

      <DietDialog
        visible={showDietDialog}
        onClose={() => setShowDietDialog(false)}
        onSuccess={() => {
          setShowDietDialog(false);
          // 刷新数据
          $app.$DefaultApi.getDietHotToday().then((res: any) => {
            if (res.code === 200 && res.data !== undefined) {
              setDietCalories(res.data);
            }
          });
        }}
      />

      <SleepDialog
        visible={showSleepDialog}
        onClose={() => setShowSleepDialog(false)}
        onSuccess={() => {
          setShowSleepDialog(false);
          // 刷新数据
          $app.$DefaultApi.getSleepLatest().then((res: any) => {
            if (res.code === 200 && res.data) {
              setSleepData(res.data);
            }
          });
        }}
      />
    </div>
  )
}
