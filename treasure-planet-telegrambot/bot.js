import { Telegraf } from 'telegraf';
import { MongoClient } from 'mongodb';

const botToken = '7635446802:AAHMViYqQ_zNB4_l0i8_voL9-LcKQuVPLOI';

const mongoURI = 'mongodb+srv://heravimh:GinDNrQBzT6ioQi5@planet0.xk6x7.mongodb.net/?retryWrites=true&w=majority&appName=planet0'; // Your MongoDB URI

async function connectToMongo() {
  const client = new MongoClient(mongoURI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

(async () => {
  const bot = new Telegraf(botToken);
  const db = await connectToMongo();

  // ... (rest of the bot code - createPlayKeyboard, bot.start, bot.action, bot.command, bot.launch, bot.setMyCommands) ...

  function createPlayKeyboard(telegramUserId) {
    const webAppUrl = `https://example.com?telegramUserId=${telegramUserId}`; // HTTPS URL
    return {
      reply_markup: {
        inline_keyboard: [[{ text: 'Play', web_app: { url: webAppUrl } }]],
      },
    };
  }

  bot.start(async (ctx) => {
    const telegramUserId = ctx.from.id;
    ctx.reply('Welcome to Treasure Planet! Click "Play" to start.', createPlayKeyboard(telegramUserId));
  });

  bot.action('play', async (ctx) => {
    const telegramUserId = ctx.from.id;
    let user = await db.collection('users').findOne({ telegramUserId });

    if (!user) {
      user = { telegramUserId, webAppAuthorized: false };
      await db.collection('users').insertOne(user);
    }

    if (!user.webAppAuthorized) {
      await db.collection('users').updateOne(
        { telegramUserId },
        { $set: { webAppAuthorized: true } }
      );
    }
      ctx.reply('Opening the web app...', createPlayKeyboard(telegramUserId));


  });

  bot.help((ctx) => ctx.reply('Just click /play or /start and then the "Play" button!'));

  bot.command('play', async (ctx) => {
    const telegramUserId = ctx.from.id;
    const user = await db.collection('users').findOne({ telegramUserId });

    if (!user || !user.webAppAuthorized) {
      return ctx.reply("Please use /start first to authorize the web app.");
    }

    ctx.reply('Opening the web app...', createPlayKeyboard(telegramUserId));
  });

  bot.launch().then(async () => {
    try {
      await bot.setMyCommands([
        { command: 'play', description: 'Start playing Treasure Planet' },
        { command: 'help', description: 'Get help with the bot' },
      ]);
      console.log("Bot commands set successfully!");
    } catch (err) {
      console.error("Error setting bot commands:", err);
    }
  });

  console.log('Telegram bot started.');
})();