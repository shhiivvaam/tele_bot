import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BotService {
    private bot: Telegraf;
    private readonly logger = new Logger(BotService.name);

    constructor(private readonly configService: ConfigService) {
        this.bot = new Telegraf(this.configService.get('TELEGRAM_BOT_TOKEN'));

        this.bot.start((ctx) => {
            ctx.reply('Welcome! Use /subscribe to get daily weather updates.');
        });

        this.bot.command('subscribe', async (ctx) => {
            const chatId = ctx.message.chat.id;
            await this.subscribeUser(chatId);
            ctx.reply('You have subscribed for daily weather updates.');
        });

        this.bot.launch();
    }

    async subscribeUser(chatId: number) {
        // Save chatId to a database or in-memory store
    }

    async sendDailyWeatherUpdate() {
        // Fetch weather data and send to all subscribers
    }

    async fetchWeather() {
        const apiKey = this.configService.get('WEATHER_API_KEY');
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=your_city&appid=${apiKey}`);
        return response.data;
    }
}
