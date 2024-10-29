import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Send, Copy, Eye } from 'lucide-react';

export default function OrderForm() {
  const [orders, setOrders] = useState({});
  
  const categories = {
    'TOPLI NAPICI': [
      'ESPRESSO (gr)',
      'NES KAFA (gr)',
      'ČAJ (kom)',
      'TOPLA ČOKOLADA (kom)'
    ],
    'BEZALKOHOLNA': [
      'ROSA 0.33',
      'ROSA 0.7',
      'KOKA KOLA',
      'FANTA',
      'SPRITE'
    ],
    'PIVO': [
      'TUBORG 0.3',
      'LAV 0.3',
      'CARLSBERG 0.25'
    ]
  };

  const updateOrder = (item, value) => {
    if (value > 0) {
      setOrders({...orders, [item]: value});
    } else {
      const newOrders = {...orders};
      delete newOrders[item];
      setOrders(newOrders);
    }
  };

  const generateOrder = () => {
    let message = `📋 NARUDŽBA ${new Date().toLocaleDateString('hr')}\n\n`;
    Object.entries(categories).forEach(([category, items]) => {
      const categoryOrders = items.filter(item => orders[item]);
      if (categoryOrders.length > 0) {
        message += `${category}\n`;
        categoryOrders.forEach(item => {
          message += `${orders[item]} × ${item}\n`;
        });
        message += '\n';
      }
    });
    return message;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateOrder());
    alert('Narudžba kopirana!');
  };

  return (
    <Card className="max-w-md mx-auto min-h-screen">
      <CardHeader className="bg-blue-500 text-white">
        <h2 className="text-xl font-bold text-center">Narudžba pića</h2>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="border rounded-lg p-4">
            <h3 className="font-bold mb-3">{category}</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="flex-1">{item}</div>
                  <div className="flex items-center gap-2">
                    {orders[item] > 0 && (
                      <Button
                        onClick={() => updateOrder(item, (orders[item] || 0) - 1)}
                        className="bg-red-500 hover:bg-red-600 h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <Input
                      type="number"
                      value={orders[item] || ''}
                      onChange={(e) => updateOrder(item, parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                      placeholder="0"
                    />
                    <Button
                      onClick={() => updateOrder(item, (orders[item] || 0) + 1)}
                      className="bg-green-500 hover:bg-green-600 h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-4">
          <Button
            onClick={copyToClipboard}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            disabled={Object.keys(orders).length === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Kopiraj
          </Button>
          <Button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generateOrder())}`)}
            className="flex-1 bg-green-500 hover:bg-green-600"
            disabled={Object.keys(orders).length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Pošalji
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
