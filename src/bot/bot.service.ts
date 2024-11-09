import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as cron from 'node-cron'

@Injectable()
export class BotService {
    private bot: Telegraf;
    private readonly logger = new Logger(BotService.name);
    private subscribers: { chatId: number, latitude: number, longitude: number }[] = [];

    constructor(private readonly configService: ConfigService) {

        const telegramToken = this.configService.get('TELEGRAM_BOT_TOKEN');
        if (!telegramToken) {
            throw new Error('TELEGRAM_BOT_TOKEN is not set in the environment variables');
        }

        this.bot = new Telegraf(telegramToken);

        this.bot.start((ctx) => {
            ctx.reply('Welcome! Use /subscribe to get daily weather updates.');
        });

        this.bot.command('subscribe', async (ctx) => {
            const chatId = ctx.message.chat.id;
            const isSubscribed = this.subscribers.some((user) => user.chatId === chatId);
            if (isSubscribed) {
                return ctx.reply('You are already subscribed for daily weather updates!');
            }

            ctx.reply('Please share your location for weather updates.', 
                Markup.keyboard([Markup.button.locationRequest('📍 Send Location')]).oneTime().resize());
            });

            this.bot.on('location', async (ctx) => { 
                const { latitude, longitude } = ctx.message.location; 
                const weather = await this.getWeather(latitude, longitude); 
                ctx.reply(`The current weather at your location is: ${weather}`); 
                // Save user data to a database or in-memory store 
                await this.subscribeUser(ctx.message.chat.id, latitude, longitude); 
                ctx.reply('You are now subscribed for daily weather updates'); 
            }); 

            cron.schedule('0 7 * * *', () => { 
                this.sendDailyWeatherUpdate();
                this.logger.log(`Daily weather update sent`);
            });

            this.bot.launch()
                .then(() => this.logger.log('Bot has been launched'))
                .catch((error) => this.logger.error(`Bot launch failed: ${error.message}`));
    }   

    async sendDailyWeatherUpdate() {

        const updatePromises = this.subscribers.map(async (subscriber) => {
            try {
                const weather = await this.getWeather(subscriber.latitude, subscriber.longitude);
                await this.bot.telegram.sendMessage(
                    subscriber.chatId,
                    `Good morning! The current weather at your location is: ${weather}`
                );
            } catch (error) {
                this.logger.error(`Failed to send weather update to ${subscriber.chatId}: ${error.message}`);
            }
        });

        await Promise.all(updatePromises);

        // for (const subscriber of this.subscribers) {
        //     try {
        //         const weather = await this.getWeather(subscriber.latitude, subscriber.longitude);
        //         await this.bot.telegram.sendMessage(
        //             subscriber.chatId,
        //             `Good morning! The current weather at your location is: ${weather}`
        //         );
        //     } catch (error) {
        //         this.logger.error(`Failed to send weather update to ${subscriber.chatId}: ${error.message}`);
        //     }
        // }
    }

    async subscribeUser(chatId: number, latitude: number, longitude: number) {
        const isSubscribed = this.subscribers.some((user) => user.chatId === chatId);
        if (!isSubscribed) {
            this.subscribers.push({ chatId, latitude, longitude });
            this.logger.log(`User ${chatId} subscribed with location (${latitude}, ${longitude})`);
        } else {
            this.logger.log(`User ${chatId} is already subscribed`);
        }
    }

    async getWeather(latitude: number, longitude: number) {
        try {
            const apiKey = this.configService.get('WEATHER_API_KEY');
            if (!apiKey) throw new Error('WEATHER_API_KEY is not set in the environment variables');

            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
            );

            const weatherDescription = response.data.weather[0].description;
            const temp = (response.data.main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
            return `${weatherDescription}, with a temperature of ${temp}°C.`;
        } catch (error) {
            this.logger.error(`Failed to fetch weather data: ${error.message}`);
            return 'Unable to retrieve weather data at this time.';
        }
    }
}
