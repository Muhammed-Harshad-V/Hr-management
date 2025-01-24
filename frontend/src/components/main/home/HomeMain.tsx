import HomeCount from "./HomeCount"
import HomeEarningsChart from "./HomeEarningsChart"
import PendingLeave from "./PendingLeave"
import TodayCheckIn from "./TodayCheckIn"

function HomeMain() {
  return (
    <>
    <div>
    <HomeCount/>
    </div>

    <div className="mb-4">
    <HomeEarningsChart/>
    </div>

    <div className="mb-4 flex flex-col justify-center gap-2 ineedit:flex ineedit:flex-row">
      <div className="sm:flex sm:justify-center ineedit:max-w-[300px] ineedit:min-w-[300px] ineedit:block">
    <TodayCheckIn/>
      </div>
    <PendingLeave/>
    </div>
    </>
  )
}

export default HomeMain