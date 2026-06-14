import { Prisma } from "@prisma/client";

// Instantiate the database connection passing runtime options directly
const prisma = new Prisma.PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://postgres:postgres@localhost:5433/online_judge?schema=public",
    },
  },
});

async function main() {
  console.log("🌱 Starting safe database seeding execution sequence...");

  // Clear out old records cleanly
  await prisma.problem.deleteMany();

  // 1. Seed Two Sum
  await prisma.problem.create({
    data: {
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      description:
        "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
      starterCode: JSON.stringify({
        javascript:
          "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
        python:
          "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
        cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      }),
      testCases: JSON.stringify([
        { stdin: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
        { stdin: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      ]),
    },
  });

  // 2. Seed Sort Colors
  await prisma.problem.create({
    data: {
      title: "Sort Colors",
      difficulty: "Medium",
      category: "Arrays",
      description:
        "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent.\n\nWe will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.",
      starterCode: JSON.stringify({
        javascript:
          "/**\n * @param {number[]} nums\n * @return {void} Do not return anything, modify nums in-place instead.\n */\nvar sortColors = function(nums) {\n    \n};",
        python:
          "class Solution:\n    def sortColors(self, nums: List[int]) -> None:\n        pass",
        cpp: "class Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        \n    }\n};",
      }),
      testCases: JSON.stringify([
        { stdin: "[2,0,2,1,1,0]", expectedOutput: "[0,0,1,1,2,2]" },
        { stdin: "[2,0,1]", expectedOutput: "[0,1,2]" },
      ]),
    },
  });

  console.log(
    "🌱 Database seeded successfully with synchronized schema fields!",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
