import pandas as pd
import tkinter as tk
import math

COLORS = ["red", "green", "blue"]

class Point:
  def __init__(self,x,y,type):
    self.x = x
    self.y= y
    self.type = type

class ScatterPlot:
    
    def __init__(self, data):
        self.data = data
        # self.scatter_plot(data)
        

        
    def get_type(self, point):
        return point.type

    def draw_points(self, data, x_range, y_range, types):
        points = []
        for point in data:
            point.x = 400 + point.x * (350/x_range)
            point.y = 400 - point.y * (350/y_range)
            # point.y = round(400 - i*(350/x_range))  
            index = types.index(point.type)
            if index == 0:    
                points.append(self.canvas.create_oval(point.x-5, point.y-5, point.x+5, point.y+5, fill=COLORS[index]))
            elif index == 1:
                points.append(self.canvas.create_rectangle(point.x-5, point.y-5, point.x+5, point.y+5,
                    fill=COLORS[index]))
            else:
                points.append(self.canvas.create_text(point.x, point.y, text="+", fill=COLORS[index], font=("Purisa", 30)))

        return points
        

    def scatter_plot(self, data):
        window = tk.Tk()
        window.title("Scatter Plot")
        self.canvas = tk.Canvas(window, width=800, height=800)
        self.canvas.pack()  
        

        # Draw axis x and y
        # create_line(x1, y1, x2, y2)
        self.canvas.create_line(50, 400, 750, 400, fill="black", width=5)
        self.canvas.create_line(400, 750, 400, 50, fill="black", width=5)
        self.canvas.create_text(700, 700, text="X-axis")
        self.canvas.create_text(25, 25, text="Y-axis")

        # Get min and max values
        xMin = min(data,key=lambda point:point.x)
        yMin = min(data,key=lambda point:point.y)
        xMax = max(data,key=lambda point:point.x)
        yMax = max(data,key=lambda point:point.y)

        # Ranges for x and y
        x_range = round(max(abs(xMin.x), abs(xMax.x)))
        y_range = round(max(abs(yMin.y), abs(yMax.y)))
        
        ####################
        # DRAW TICKS
        ####################
        for i in range(-x_range, x_range+1, round(x_range*2/11)):
            # x = 50 + (350 / x_range) * i
            x = round(400 + i*(350/x_range))
            self.canvas.create_line(x, 390, x, 410, width=1)  
            self.canvas.create_text(round(x), 425, text=str(i))
        # Y
        for i in range(-y_range, y_range+1, round(y_range*2/11)):
            y = round(400 - i*(350/y_range))
            self.canvas.create_line(390, y, 410, y, width=1)  
            self.canvas.create_text(425, y, text=str(i))

        ####################
        # DRAW POINTS
        ####################
        types = set(map(self.get_type, data))
        types = list(types)

        points = self.draw_points(data, x_range, y_range, types)

        i = 0
        for point in points:         
            # print(point)
            i += 1
            # self.canvas.tag_bind(point, "<Enter>", point_click())
            self.canvas.tag_bind(point, '<Button-1>', self.object_click_event) # Left click
            self.canvas.tag_bind(point, '<Button-2>', self.object_right_click_event) # Right click

    
        ####################
        # CREATE LEGEND
        ####################
        legend_text = f"""
            -------------------
            |    {[types[0]]}    |
            |   ------     line2    |
            |   ------     line3    |
            -------------------"""


        # root = tk.Tk()
        # root.geometry('250x150')
    
        # This will create a LabelFrame
        label_frame = tk.LabelFrame(window, text='This is Label Frame')
        
        label1 = tk.Label(label_frame, text='1. This is a Label.')
        label1.pack()
        self.canvas.create_window(50, 100, window=label_frame, anchor="w")
        
        label1.place(x=50, y=5)
        
        label2 = tk.Label(label_frame, text='2. This is another Label.')
        label2.place(x=0, y=35)
        
        label3 = tk.Label(label_frame,
                    text='3. We can add multiple\n    widgets in it.')
        
        label3.place(x=0, y=65)   

        window.mainloop()


    def object_click_event(self, event):
        print(event.widget)
        self.canvas.itemconfigure(event.num, fill="blue")
        # print('Clicked object at: ', self.canvas.coords(event.num), event.num)    


    def object_right_click_event(self, event):
        print("rigth click")
        # self.canvas.itemconfigure(event.num, fill="blue")
        # print('Clicked object at: ', self.canvas.coords(event.num), event.num)    

    def canvas_click_event(self, event):
        print('Clicked canvas: ', event.x, event.y, event.widget)
   

# load csv
def load_csv(file):
    data = []
    with open(file, "r") as file:
        for line in file:
            values = line.strip().split(",")
            data.append(Point(
                float(values[0]),
                float(values[1]),
                values[2]
            ))
    return data

if __name__ == "__main__":
    data = load_csv("data1.csv")
    # scatter_plot(data)
    sp = ScatterPlot(data)
    sp.scatter_plot(data)