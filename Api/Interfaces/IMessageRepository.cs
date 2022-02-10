using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.DTOs;
using Api.Entities;
using Api.Helpers;

namespace Api.Interfaces
{
    public interface IMessageRepository
    {
        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetMessageGroup(string groupName);
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);
        Task<bool> SaveAllAsync();
    }
}