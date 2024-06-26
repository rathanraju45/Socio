// src/chatData.js
import faker from 'faker';

const chatData = [];

for (let i = 0; i < 20; i++) {
    const profilePic = `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`;
    const chat = {
        id: i + 1,
        name: faker.name.findName(),
        status: faker.random.boolean() ? 'Online' : 'Offline',
        profilePic: profilePic,
        messages: [],
    };

    for (let j = 0; j < 50; j++) {
        const message = {
            sender: Math.random() < 0.5 ? 'You' : chat.name,
            text: faker.lorem.sentence(),
            time: new Date(),
        };
        chat.messages.push(message);
    }

    chatData.push(chat);
}

export default chatData;