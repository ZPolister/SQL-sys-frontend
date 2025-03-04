import {Button, Card} from "tdesign-react";
import {AddIcon} from "tdesign-icons-react";

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
  return (
    <div className={"p-6 flex flex-col gap-5"}>

      <Card
        title={"目标"}
        // actions={(
        //   <Button theme="primary" variant="text" icon={<AddIcon/>}>
        //     添加记录
        //   </Button>
        // )}
      >
        <div className={"w-full h-20 flex flex-row items-center justify-center"}>
          <div>EChart图表</div>
        </div>
      </Card>

      <DataCard title={"体征数据"} />
      <DataCard title={"运动数据"} />
      <DataCard title={"饮食数据"} />
      <DataCard title={"睡眠数据"} />
    </div>
  )
}
