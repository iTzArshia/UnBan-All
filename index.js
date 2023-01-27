const Discord = require('discord.js');
const prompt = require('prompt');
const chalk = require('chalk');

console.log(chalk.bold.white('Hi, Don\'t forget to star the repository!'));

prompt.start();

const schema = {
    properties: {
        guildId: {
            description: chalk.blueBright('Enter your Server ID'),
            message: chalk.redBright('Server ID is required'),
            required: true
        },
        botToken: {
            description: chalk.blueBright('Enter your Bot Token'),
            message: chalk.redBright('Bot Token is required'),
            required: true
        }
    }
};

prompt.get(schema, function (err, result) {

    const client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.GuildBans,
        ]
    });

    client.on('ready', async () => {

        console.log(chalk.greenBright(`logged in into "${client.user.tag}"`));

        const guild = client.guilds.cache.get(result.guildId);
        if (!guild) {

            console.log(chalk.redBright(`I didn't find any server with "${result.guildId}" id!`));
            console.log(chalk.bold.white('Goodbye and don\'t forget to star the repository!'));
            return process.exit();

        } else {

            if (!guild.members.me.permissions.has('BanMembers')) {

                console.log(chalk.redBright(`I don't have Ban Members permission in "${guild.name}"`));
                console.log(chalk.bold.white('Goodbye and don\'t forget to star the repository!'));
                return process.exit();

            } else {

                const bannedMembersCollection = await guild.bans.fetch();

                if (bannedMembersCollection.size === 0) {

                    console.log(chalk.redBright(`No one is banned in "${guild.name}"`));
                    console.log(chalk.bold.white('Goodbye and don\'t forget to star the repository!'));
                    return process.exit();

                };

                console.log(chalk.blueBright(`"${client.user.tag}" found ${bannedMembersCollection.size} banned users in "${guild.name}"!`));

                const schema = {
                    properties: {
                        boolean: {
                            description: chalk.yellow(`Are you sure you want to unban ${bannedMembersCollection.size} users from "${guild.name}"? (Enter "Yes" or "Y" to start and anything else to cancel)`),
                            message: chalk.redBright('You have to enter "Yes" or "Y"to start and anything else to cancel'),
                            required: true
                        }
                    }
                };

                prompt.get(schema, async function (err, result) {

                    if (['yes', 'y'].includes(result.boolean.toLocaleLowerCase())) {

                        console.log(chalk.blueBright(`"${client.user.tag}" is unbaning ${bannedMembersCollection.size} users, this will take ${convertTime(bannedMembersCollection.size * 1000)} in ideal conditions, please be patient and don't close the terminal!`));

                        for (const ban of bannedMembersCollection.values()) {

                            console.log(`${ban.user.tag} was unbanned!`);
                            await guild.bans.remove(ban.user.id);
                            await delay(1000);

                        };

                        function convertTime(time) {

                            const absoluteSeconds = Math.floor((time / 1000) % 60);
                            const absoluteMinutes = Math.floor((time / (1000 * 60)) % 60);
                            const absoluteHours = Math.floor((time / (1000 * 60 * 60)) % 24);
                            const absoluteDays = Math.floor(time / (1000 * 60 * 60 * 24));
                            const d = absoluteDays
                                ? absoluteDays === 1
                                    ? "1 day"
                                    : `${absoluteDays} days`
                                : null;
                            const h = absoluteHours
                                ? absoluteHours === 1
                                    ? "1 hour"
                                    : `${absoluteHours} hours`
                                : null;
                            const m = absoluteMinutes
                                ? absoluteMinutes === 1
                                    ? "1 minute"
                                    : `${absoluteMinutes} minutes`
                                : null;
                            const s = absoluteSeconds
                                ? absoluteSeconds === 1
                                    ? "1 second"
                                    : `${absoluteSeconds} seconds`
                                : null;
                            const absoluteTime = [];
                            if (d) absoluteTime.push(d);
                            if (h) absoluteTime.push(h);
                            if (m) absoluteTime.push(m);
                            if (s) absoluteTime.push(s);
                            return absoluteTime.join(" and ");

                        };

                        function delay(ms) {

                            return new Promise(resolve => {
                                setTimeout(() => resolve(), ms);
                            });

                        };

                        console.log(chalk.greenBright(`I unbanned ${bannedMembersCollection.size} users from "${guild.name}"!`))
                        console.log(chalk.bold.white('Goodbye and don\'t forget to star the repository!'));

                        return process.exit();

                    } else {

                        console.log(chalk.bold.white('Goodbye and don\'t forget to star the repository!'));
                        return process.exit();

                    };

                });

            };

        };

    });

    client.login(result.botToken).catch(() => {
        console.log(chalk.redBright('I can\'t login into your bot recheck your token!'));
    });

});