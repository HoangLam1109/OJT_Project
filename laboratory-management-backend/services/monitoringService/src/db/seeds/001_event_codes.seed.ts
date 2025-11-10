import connectDB from "../../config/database.config.js";
import EventCode from "../models/EventCode.model.js";
import { EVENT_CODES, EVENT_CATEGORIES } from "../../constants/event.constant.js";

const eventCodesData = [
  {
    event_code: EVENT_CODES.TEST_ORDER_CREATED,
    event_name: "TEST_ORDER_CREATED",
    description: "Test order created",
    category: EVENT_CATEGORIES.TEST_ORDER,
  },
  {
    event_code: EVENT_CODES.TEST_ORDER_UPDATED,
    event_name: "TEST_ORDER_UPDATED",
    description: "Test order updated",
    category: EVENT_CATEGORIES.TEST_ORDER,
  },
  {
    event_code: EVENT_CODES.TEST_ORDER_DELETED,
    event_name: "TEST_ORDER_DELETED",
    description: "Test order deleted",
    category: EVENT_CATEGORIES.TEST_ORDER,
  },
  {
    event_code: EVENT_CODES.TEST_RESULT_MODIFIED,
    event_name: "TEST_RESULT_MODIFIED",
    description: "Test result modified",
    category: EVENT_CATEGORIES.TEST_RESULT,
  },
  {
    event_code: EVENT_CODES.COMMENT_ADDED,
    event_name: "COMMENT_ADDED",
    description: "Comment added",
    category: EVENT_CATEGORIES.COMMENT,
  },
  {
    event_code: EVENT_CODES.COMMENT_MODIFIED,
    event_name: "COMMENT_MODIFIED",
    description: "Comment modified",
    category: EVENT_CATEGORIES.COMMENT,
  },
  {
    event_code: EVENT_CODES.COMMENT_DELETED,
    event_name: "COMMENT_DELETED",
    description: "Comment deleted",
    category: EVENT_CATEGORIES.COMMENT,
  },
  {
    event_code: EVENT_CODES.REVIEW_COMPLETED,
    event_name: "REVIEW_COMPLETED",
    description: "Review completed",
    category: EVENT_CATEGORIES.REVIEW,
  },
  {
    event_code: EVENT_CODES.INSTRUMENT_STATUS_CHANGED,
    event_name: "INSTRUMENT_STATUS_CHANGED",
    description: "Instrument activated/deactivated",
    category: EVENT_CATEGORIES.INSTRUMENT,
  },
  {
    event_code: EVENT_CODES.USER_STATUS_CHANGED,
    event_name: "USER_STATUS_CHANGED",
    description: "User locked/unlocked",
    category: EVENT_CATEGORIES.USER,
  },
];

const seedEventCodes = async (): Promise<void> => {
  try {
    console.log("\n🌱 Starting Event Codes Seeding...");

    await connectDB();

    // Clear existing event codes
    await EventCode.deleteMany({});
    console.log("✅ Cleared existing event codes");

    // Insert new event codes
    const insertedCodes = await EventCode.insertMany(eventCodesData);
    console.log(`✅ Inserted ${insertedCodes.length} event codes`);

    console.log("\n📋 Event Codes Summary:");
    for (const code of insertedCodes) {
      console.log(`   - ${code.event_code}: ${code.event_name} (${code.category})`);
    }

    console.log("\n✅ Event Codes Seeding Completed Successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding event codes:", error);
    process.exit(1);
  }
};

seedEventCodes();
