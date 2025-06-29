export class DateTimeUtil {
    static getGreeting(): string {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            return 'Good morning';
        } else if (hour >= 12 && hour < 17) {
            return 'Good afternoon';
        } else if (hour >= 17 && hour < 21) {
            return 'Good evening';
        } else {
            return 'Good night';
        }
    }
    
    static getFormattedDate(): string {
        const now = new Date();
        return now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    static getFormattedTime(): string {
        const now = new Date();
        return now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    static getWeekNumber(): number {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    }
    
    static getDayOfYear(): number {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - startOfYear.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    static getTimeUntilEndOfDay(): string {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        const diff = endOfDay.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m left today`;
    }
    
    static formatDateCustom(date: Date, format: string): string {
        // Simple date formatting function
        // Supports common patterns like YYYY, MM, DD, EEEE, MMMM, etc.
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = date.getDay();
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const monthNamesShort = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const weekdayNames = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ];
        
        const weekdayNamesShort = [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ];
        
        let result = format;
        
        // Year patterns
        result = result.replace(/yyyy/g, year.toString());
        result = result.replace(/yy/g, (year % 100).toString().padStart(2, '0'));
        
        // Month patterns
        result = result.replace(/MMMM/g, monthNames[month - 1]);
        result = result.replace(/MMM/g, monthNamesShort[month - 1]);
        result = result.replace(/MM/g, month.toString().padStart(2, '0'));
        result = result.replace(/M/g, month.toString());
        
        // Day patterns
        result = result.replace(/dd/g, day.toString().padStart(2, '0'));
        result = result.replace(/d/g, day.toString());
        
        // Weekday patterns
        result = result.replace(/EEEE/g, weekdayNames[weekday]);
        result = result.replace(/EEE/g, weekdayNamesShort[weekday]);
        
        return result;
    }
    
    static formatTimeCustom(date: Date, format: string): string {
        const hours24 = date.getHours();
        const hours12 = hours24 % 12 || 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours24 >= 12 ? 'PM' : 'AM';
        
        let result = format;
        
        // Hour patterns
        result = result.replace(/HH/g, hours24.toString().padStart(2, '0'));
        result = result.replace(/H/g, hours24.toString());
        result = result.replace(/hh/g, hours12.toString().padStart(2, '0'));
        result = result.replace(/h/g, hours12.toString());
        
        // Minute patterns
        result = result.replace(/mm/g, minutes.toString().padStart(2, '0'));
        result = result.replace(/m/g, minutes.toString());
        
        // Second patterns
        result = result.replace(/ss/g, seconds.toString().padStart(2, '0'));
        result = result.replace(/s/g, seconds.toString());
        
        // AM/PM patterns
        result = result.replace(/a/g, ampm);
        result = result.replace(/A/g, ampm);
        
        return result;
    }
}