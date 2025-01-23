import HomeCount from "./HomeCount"
import HomeEarningsChart from "./HomeEarningsChart"
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

    <div className="mb-4">
    <TodayCheckIn/>
    </div>
    </>
  )
}

export default HomeMain