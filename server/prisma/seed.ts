import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tasks = [
    {
      title: "Join Telegram Channel",
      description: "Join our official Telegram channel and stay updated with the latest news",
      telegramTaskId: "join_channel_123",
      rewardPoints: 100,
    },
    {
      title: "Follow on Twitter",
      description: "Follow our Twitter account and retweet the pinned post",
      telegramTaskId: "twitter_follow_456",
      rewardPoints: 150,
    },
    {
      title: "Share on Social Media",
      description: "Share our project on your social media and tag 3 friends",
      telegramTaskId: "social_share_789",
      rewardPoints: 200,
    },
    {
      title: "Complete Quiz",
      description: "Take our quiz about the project and score at least 80%",
      telegramTaskId: "quiz_complete_101",
      rewardPoints: 250,
    },
    {
      title: "Write Review",
      description: "Write a detailed review of our platform (min 100 words)",
      telegramTaskId: "write_review_202",
      rewardPoints: 300,
    },
    {
      title: "Invite Friends",
      description: "Invite 5 friends to join the platform",
      telegramTaskId: "invite_friends_303",
      rewardPoints: 500,
    },
  ];

  console.log("Seeding tasks...");

  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
    console.log(`Created task: ${task.title}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
