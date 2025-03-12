import logging
from src.monitor import OddsMonitor

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("odds_monitor.log"), logging.StreamHandler()],
)


def main():
    monitor = OddsMonitor()
    monitor.run()


if __name__ == "__main__":
    main()
