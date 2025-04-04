import { Laptop, LucideIcon, Smartphone } from "lucide-react";
import { UAParser } from "ua-parser-js";
import { format, formatDistanceToNowStrict, isPast } from 'date-fns';


type DeviceType = "desktop" | "mobile";

interface UserAgentType {
    deviceType: string;
    browser: string;
    os: string;
    timeAgo: string
    icon: LucideIcon
}

export const parseUserAgent = (userAgent: string, createdAt: string): UserAgentType => {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const deviceType = result.device.type || "";
    const browser = result.browser.name || "Web";
    const os = result.os.name ? `${result.os.name} ${result.os.version || "Unknown Version"}` : "Unknown OS";
    const icon = deviceType === "mobile" ? Smartphone : Laptop;



    if (!createdAt || isNaN(new Date(createdAt).getTime())) {
        return {
            deviceType,
            browser,
            os,
            icon,
            timeAgo: "Unknow Date"
        };
    };

    const createdDate = new Date(createdAt);

    const formatted = isPast(new Date(createdDate)) ?
        `${formatDistanceToNowStrict(new Date(createdDate))} ago`
        : format(createdDate, "d MMM, yyyy");



    return {
        deviceType,
        browser,
        os,
        icon,
        timeAgo: formatted
    }
}