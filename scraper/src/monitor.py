from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from datetime import datetime
from .scraper import scrape_odds
import logging

logger = logging.getLogger(__name__)


class OddsMonitor:
    def __init__(self):
        self.scheduler = BlockingScheduler()
        self.last_execution_time = None

    def run(self):
        self.scheduler.add_job(
            scrape_odds,
            "interval",
            minutes=2,
            id="check_odds",
            max_instances=1,
            coalesce=True,  # If multiple instances are missed, only run once
        )

        logger.info("Starting scheduler...")
        # Run check_seats immediately when starting
        logger.info("Running initial check...")
        scrape_odds()
        try:
            self.scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            logger.info("Scheduler stopped")


if __name__ == "__main__":
    monitor = OddsMonitor()
    monitor.run()
