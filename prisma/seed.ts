// 💡 .ts extension explicitly laga diya hai taaki module not found ka error na aaye
import prisma from "../src/lib/prisma.ts";

async function main() {
  console.log("Seeding database...");

  // Clear out old records
  await prisma.problem.deleteMany({});

  await prisma.problem.create({
    data: {
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
      starterCode: JSON.stringify({
        javascript: "function twoSum(nums, target) {\n  // Write code here\n}",
        python: "def twoSum(nums, target):\n    pass",
        cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      }),
      testCases: JSON.stringify([
        { stdin: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      ]),
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
