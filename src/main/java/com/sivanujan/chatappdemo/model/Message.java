package com.sivanujan.chatappdemo.model;

import javax.persistence.*;

@Entity
@Table(name="Message")
public class Message {
    @Id
    private long id;
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="messageType")
    private MessageType messageType;
    @Column(name="content")
    private String content;
    @Column(name="sender")
    private String sender;

public Message(){

}

    public Message(MessageType messageType, String content, String sender) {
        this.messageType = messageType;
        this.content = content;
        this.sender = sender;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
    public enum MessageType {
        JOIN,CHAT, LEAVE
    }


}