const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  static async parseTask(text) {
    try {
      // Get current date and time in IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);

      // Format current date and time clearly for AI
      const currentDay = istNow.getDate().toString().padStart(2, "0");
      const currentMonth = (istNow.getMonth() + 1).toString().padStart(2, "0");
      const currentYear = istNow.getFullYear();
      const currentHour = istNow.getHours().toString().padStart(2, "0");
      const currentMinute = istNow.getMinutes().toString().padStart(2, "0");

      const currentDateIST = `${currentDay}/${currentMonth}/${currentYear}`;
      const currentTimeIST = `${currentHour}:${currentMinute}`;

      // Calculate tomorrow's date
      const tomorrowIST = new Date(istNow.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowDay = tomorrowIST.getDate().toString().padStart(2, "0");
      const tomorrowMonth = (tomorrowIST.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const tomorrowYear = tomorrowIST.getFullYear();
      const tomorrowDateIST = `${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}`;

      const prompt = `Parse the following task into a structured format. Extract the task description, assignee, due date/time, and priority (default to P3 if not specified).

CURRENT DATE AND TIME IN IST: ${currentDateIST} ${currentTimeIST}
TODAY'S DATE: ${currentDateIST}
TOMORROW'S DATE: ${tomorrowDateIST}

CRITICAL RULES for date/time parsing:
1. ALL dates must be interpreted in DD/MM/YYYY format (e.g., "15/6/2025" = 15th June 2025)
2. ALL times are in Indian Standard Time (IST = UTC+5:30)
3. When converting to UTC for dueDate field: SUBTRACT exactly 5 hours and 30 minutes from IST time
   EXAMPLE: 21:30 IST - 5:30 = 16:00 UTC
4. For relative dates:
   - "today" = ${currentDateIST}
   - "tomorrow" = ${tomorrowDateIST}
   - "tonight" = today after 6 PM
   - "morning" = 9:00 AM IST
   - "afternoon" = 2:00 PM IST  
   - "evening" = 6:00 PM IST
   - "night" = 9:00 PM IST
5. Time formats: "9:30pm" = 21:30 IST, "4 am" = 04:00 IST
6. If no time specified, use 23:59 IST
7. Priority: P1, P2, P3, P4 (default P3)

CONVERSION EXAMPLES:
- "today 9:30pm" = ${currentDateIST} 21:30 IST = ${currentYear}-${currentMonth}-${currentDay}T16:00:00.000Z
- "today night 9:30pm" = ${currentDateIST} 21:30 IST = ${currentYear}-${currentMonth}-${currentDay}T16:00:00.000Z
- "tomorrow 2pm" = ${tomorrowDateIST} 14:00 IST = ${tomorrowYear}-${tomorrowMonth.padStart(
        2,
        "0"
      )}-${tomorrowDay}T08:30:00.000Z
- "15/6/2025 4am" = 15/06/2025 04:00 IST = 2025-06-14T22:30:00.000Z

IMPORTANT: For "today night 9:30pm" or similar phrases, use TODAY'S date (${currentDateIST}) with the specified time.

Expected JSON format:
{
    "description": "task description",
    "assignee": "assignee name",
    "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "priority": "P3"
}

Task text: ${text}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a precise task parsing assistant. You MUST convert IST times to UTC by subtracting exactly 5 hours and 30 minutes. Use DD/MM/YYYY date format. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 200,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      try {
        const parsedTask = JSON.parse(content);
        // Validate required fields
        if (
          !parsedTask.description ||
          !parsedTask.assignee ||
          !parsedTask.dueDate
        ) {
          throw new Error("Missing required fields in parsed task");
        }
        return parsedTask;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse OpenAI response as valid JSON");
      }
    } catch (error) {
      console.error("Error parsing task:", error);
      throw error;
    }
  }

  static async parseTranscript(transcript) {
    try {
      // Get current date and time in IST
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istNow = new Date(now.getTime() + istOffset);

      // Format current date and time clearly for AI
      const currentDay = istNow.getDate().toString().padStart(2, "0");
      const currentMonth = (istNow.getMonth() + 1).toString().padStart(2, "0");
      const currentYear = istNow.getFullYear();
      const currentHour = istNow.getHours().toString().padStart(2, "0");
      const currentMinute = istNow.getMinutes().toString().padStart(2, "0");

      const currentDateIST = `${currentDay}/${currentMonth}/${currentYear}`;
      const currentTimeIST = `${currentHour}:${currentMinute}`;

      // Calculate tomorrow's date
      const tomorrowIST = new Date(istNow.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowDay = tomorrowIST.getDate().toString().padStart(2, "0");
      const tomorrowMonth = (tomorrowIST.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const tomorrowYear = tomorrowIST.getFullYear();
      const tomorrowDateIST = `${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}`;

      const prompt = `Parse the following meeting transcript and extract all tasks. For each task, identify the task description, assignee, due date/time, and priority (default to P3 if not specified).

CURRENT DATE AND TIME IN IST: ${currentDateIST} ${currentTimeIST}
TODAY'S DATE: ${currentDateIST}
TOMORROW'S DATE: ${tomorrowDateIST}

CRITICAL RULES for date/time parsing:
1. ALL dates must be interpreted in DD/MM/YYYY format (e.g., "15/6/2025" = 15th June 2025)
2. ALL times are in Indian Standard Time (IST = UTC+5:30)
3. When converting to UTC for dueDate field: SUBTRACT exactly 5 hours and 30 minutes from IST time
   EXAMPLE: 21:30 IST - 5:30 = 16:00 UTC
4. For relative dates:
   - "today" = ${currentDateIST}
   - "tomorrow" = ${tomorrowDateIST}
   - "tonight" = today after 6 PM
   - "morning" = 9:00 AM IST
   - "afternoon" = 2:00 PM IST  
   - "noon" = 12:00 PM IST
   - "evening" = 6:00 PM IST
   - "night" = 9:00 PM IST
   -"EOD" = 23:59 IST
   -"EOW" = 23:59 IST of the last day of the week
   -"End of day" = 23:59 IST
   -"End of week" = 23:59 IST of the last day of the week
   -"End of month" = 23:59 IST of the last day of the month
   -"End of year" = 23:59 IST of the last day of the year
5. Time formats: "9:30pm" = 21:30 IST, "4 am" = 04:00 IST
6. If no time specified, use 23:59 IST
7. Priority: P1, P2, P3, P4 (default P3)
8. Return ONLY a JSON array of tasks, no additional text

CONVERSION EXAMPLES:
- "today 9:30pm" = ${currentDateIST} 21:30 IST = ${currentYear}-${currentMonth}-${currentDay}T16:00:00.000Z
- "today night 9:30pm" = ${currentDateIST} 21:30 IST = ${currentYear}-${currentMonth}-${currentDay}T16:00:00.000Z
- "tomorrow 2pm" = ${tomorrowDateIST} 14:00 IST = ${tomorrowYear}-${tomorrowMonth.padStart(
        2,
        "0"
      )}-${tomorrowDay}T08:30:00.000Z
- "15/6/2025 4am" = 15/06/2025 04:00 IST = 2025-06-14T22:30:00.000Z

IMPORTANT: For "today night 9:30pm" or similar phrases, use TODAY'S date (${currentDateIST}) with the specified time.

Expected JSON format:
[
    {
        "description": "task description 1",
        "assignee": "assignee name 1",
        "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "priority": "P3"
    },
    {
        "description": "task description 2", 
        "assignee": "assignee name 2",
        "dueDate": "YYYY-MM-DDTHH:mm:ss.sssZ",
        "priority": "P2"
    }
]

Transcript: ${transcript}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a precise transcript parsing assistant. You MUST convert IST times to UTC by subtracting exactly 5 hours and 30 minutes. Use DD/MM/YYYY date format. Return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 600,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      try {
        let parsedContent;
        // Handle both array and object responses
        if (content.trim().startsWith("[")) {
          parsedContent = JSON.parse(content);
        } else {
          // If we got a JSON object, try to extract the tasks array
          const jsonObj = JSON.parse(content);
          parsedContent = Array.isArray(jsonObj.tasks)
            ? jsonObj.tasks
            : [jsonObj];
        }

        // Validate each task has required fields
        parsedContent.forEach((task, index) => {
          if (!task.description || !task.assignee || !task.dueDate) {
            throw new Error(
              `Task at index ${index} is missing required fields`
            );
          }
        });

        return parsedContent;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse OpenAI response as valid JSON array");
      }
    } catch (error) {
      console.error("Error parsing transcript:", error);
      throw error;
    }
  }
}

module.exports = OpenAIService;
