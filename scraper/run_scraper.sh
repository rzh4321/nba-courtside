#!/bin/bash

LOG_FILE="/home/ec2-user/scraper.log"
MAX_SIZE_MB=0.25  # Maximum size in MB
# Add at the beginning of your script
LOCK_FILE="/tmp/scraper.lock"


if [ -f "$LOCK_FILE" ]; then
    # Check if the locked process is still running
    OLD_PID=$(cat "$LOCK_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo "$(date) - Script is already running" >> "$LOG_FILE"
        exit 1
    else
        # Remove stale lock file
        rm -f "$LOCK_FILE"
    fi
fi

# Create lock file
echo $$ > "$LOCK_FILE"




cd /home/ec2-user/nba-boxscore/scraper

# Kill any hanging chrome processes
pkill -f chrome
pkill -f "chrome-driver"  # Kill chromedriver processes
pkill -f "selenium"       # Kill any selenium-related processes
sleep 2
# Clear Chrome's temporary files
rm -rf /tmp/.com.google.Chrome*
rm -rf /tmp/.org.chromium.Chromium*
rm -rf /tmp/chrome_*
rm -rf ~/.cache/selenium  # Selenium cache
rm -rf ~/.config/google-chrome/Crash\ Reports  # Chrome crash reports

# Check log file size and rotate if necessary
if [ -f "$LOG_FILE" ]; then
    size=$(du -m "$LOG_FILE" | cut -f1)
    if [ $size -gt $MAX_SIZE_MB ]; then
        # Keep last 1000 lines and save to temporary file
        tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp"
        mv "$LOG_FILE.tmp" "$LOG_FILE"
        echo "$(date) - Log file rotated" >> "$LOG_FILE"
    fi
fi

# Wait for network connectivity
max_attempts=12
attempt=1
while ! ping -c 1 -W 1 8.8.8.8 &>/dev/null; do
    if [ $attempt -ge $max_attempts ]; then
        echo "$(date) - Network connectivity not available after $max_attempts attempts. Exiting." >> "$LOG_FILE"
        exit 1
    fi
    echo "$(date) - Waiting for network connectivity... attempt $attempt" >> "$LOG_FILE"
    sleep 5
    ((attempt++))
done

# Load environment variables
set -a
source /home/ec2-user/nba-boxscore/scraper/.env
set +a

# Check CPU usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
if [ $CPU_USAGE -gt 80 ]; then
    echo "$(date) - High CPU usage: $CPU_USAGE%. Skipping this run." >> /home/ec2-user/scraper.log
    exit 1
fi
# After CPU check, add memory check
MEM_FREE=$(free | grep Mem | awk '{print $4/$2 * 100.0}')
if (( $(echo "$MEM_FREE < 20" | bc -l) )); then
    echo "$(date) - Low memory: ${MEM_FREE}% free. Skipping this run." >> "$LOG_FILE"
    exit 1
fi


# Run the scraper with error handling
/usr/bin/python3 scraper.py >> "$LOG_FILE" 2>&1
exit_code=$?

if [ $exit_code -ne 0 ]; then
    echo "$(date) - Scraper failed with exit code $exit_code" >> "$LOG_FILE"
    # Kill any hanging processes on failure
    pkill -f chrome
fi

# Always try to clean up at the end
pkill -f chrome
rm -f "$LOCK_FILE"
