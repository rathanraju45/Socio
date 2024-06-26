// src/notificationsData.js

const actions = ['liked your post', 'commented: Nice post!', 'started following you'];

const notifications = Array.from({ length: 20 }, (v, i) => ({
    id: i + 1,
    user: `User${i + 1}`,
    action: actions[i % actions.length], // Cycle through the actions array
    time: `${i + 1}h`,
    profilePic: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
}));

export default notifications;