"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export function NovaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm Nova, your personal shopping assistant. How can I help you find the perfect item today?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Mock bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm looking for products related to your query. One moment...",
        },
      ]);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          data-state={isOpen ? 'open' : 'closed'}
          className={cn(
            "w-[90vw] max-w-sm origin-bottom-right transition-all duration-300 ease-out",
            "data-[state=closed]:scale-50 data-[state=closed]:opacity-0 data-[state=closed]:-translate-y-4",
            "data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:translate-y-0"
            )}
        >
          <Card className="flex flex-col h-[70vh] max-h-[500px] shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-headline">Nova</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-2 ${
                        msg.sender === "bot" ? "justify-start" : "justify-end"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          msg.sender === "bot"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Ask for recommendations..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        
        <Button
            onClick={() => setIsOpen(true)}
            data-state={isOpen ? 'open' : 'closed'}
            className={cn(
                "rounded-full w-16 h-16 shadow-lg transition-all duration-300 ease-out",
                "data-[state=open]:scale-0 data-[state=open]:opacity-0",
                "data-[state=closed]:scale-100 data-[state=closed]:opacity-100"
            )}
            aria-label="Open Chat"
          >
            <MessageSquare className="w-8 h-8" />
          </Button>
      </div>
    </>
  );
}
