export default function createConversationKey(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return sortedIds.join(':');
}