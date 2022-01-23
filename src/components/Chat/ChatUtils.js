export function getConversationMessages(conversations, conversationId) {
  console.debug("getting conversation " + conversationId + " messages ");
  let messages = [];
  if (conversations) {
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      if (conversation._id === conversationId) {
        return conversation.messages;
      }
    }
  }
  return messages;
}

export function getConversationRecipient(conversations, conversationId) {
  console.debug("getting conversation " + conversationId + " recipient ");
  if (conversations) {
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      if (conversation.conversationId === conversationId) {
        return {
          fullName: conversation.fullName,
          username: conversation.username,
          avatar: conversation.avatar,
          lastMessage: conversation.lastMessage ?? "-",
          unread: conversation.unread ?? 0,
        };
      }
    }
  }
  return {
    fullName: "",
    avatar: "",
    username: "",
    lastMessage: "-",
    unread: 0,
  };
}
