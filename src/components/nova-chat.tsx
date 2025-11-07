"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, Bot, Loader } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { getPersonalizedProductRecommendations } from "@/ai/flows/personalized-product-recommendations";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Product } from "@/lib/types";

type Message = {
  sender: "bot" | "user";
  text: string;
}

const GREETING_DELAY = 30000; // 30 seconds

export function NovaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm Nova, your personal shopping assistant. How can I help you find the perfect item today?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"));
  }, [firestore]);
  const { data: products } = useCollection<Product>(productsQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
      }
    }, GREETING_DELAY);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || !products) return;

    const newMessages: Message[] = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    const userInput = input;
    setInput("");
    setIsBotLoading(true);

    try {
      const productList = products.map(p => `${p.name} (Price: ₹${p.price.toFixed(2)})`).join(', ');

      const recommendations = await getPersonalizedProductRecommendations({
        userInterests: userInput,
        browsingHistory: '',
        purchaseHistory: '',
        availableProducts: productList,
      });
      
      const botResponse = recommendations.recommendedProducts;
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
        },
      ]);

    } catch (error) {
      console.error("Error getting recommendations:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having a little trouble finding recommendations right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsBotLoading(false);
    }
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
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                           msg.sender === "bot"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                   {isBotLoading && (
                    <div className="flex items-end gap-2 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                      </Avatar>
                      <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted">
                        <Loader className="h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Ask for recommendations..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isBotLoading || !products}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isBotLoading || !products}>
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