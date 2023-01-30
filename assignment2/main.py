import pandas as pd
import tkinter as tk
import math

COLORS = ["red", "green", "blue"]

class Point:
  def __init__(self,x,y,type):
    self.x = x
    self.y= y
    self.type = type

    def __str__(self):
        return f'{self.x}i{self.y:+}j'

class ScatterPlot:
    
    def __init__(self, data):
        self.data = data
        self.translated = False


        
    def get_type(self, point):
        return point.type

    def draw_points(self, x_range, y_range, types):
        
        i = 0
        for point in self.data:
            i += 1
            point.x = 400 + point.x * (350/x_range)
            point.y = 400 - point.y * (350/y_range)
            # point.y = round(400 - i*(350/x_range))  
            index = types.index(point.type)
            if index == 0:    
                element = self.canvas.create_oval(point.x-5, point.y-5, point.x+5, point.y+5, fill=COLORS[index], tags=["point", f"shape{i}"])
            elif index == 1:
                element = self.canvas.create_rectangle(point.x-5, point.y-5, point.x+5, point.y+5, fill=COLORS[index], tags=["point", f"shape{i}"])                
            else:
                element = self.canvas.create_text(point.x, point.y, text="+", fill=COLORS[index], font=("Purisa", 30), tags=["point", f"shape{i}"])
                     
            self.canvas.tag_bind(element, '<Button-1>', self.object_left_click_event) # Left click
            self.canvas.tag_bind(element, '<Button-3>', self.object_right_click_event) # Right click 

        

    def scatter_plot(self):

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
        xMin = min(self.data,key=lambda point:point.x)
        yMin = min(self.data,key=lambda point:point.y)
        xMax = max(self.data,key=lambda point:point.x)
        yMax = max(self.data,key=lambda point:point.y)

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
        types = set(map(self.get_type, self.data))
        types = list(types)

        self.draw_points(x_range, y_range, types)
    
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


    def object_left_click_event(self, event):
        # self.canvas.itemconfigure(event.num, fill="blue")
        # print('Clicked object at: ', self.canvas.coords(event.num), event.num)    
        # Move all with tag "shape"
        
        move_x = 400-event.x
        move_y = 400-event.y
        
        point_ids = self.canvas.find_withtag("point")

        # Loop through all points with tag "point"
        for i in point_ids:
            self.canvas.move(i, move_x, move_y)

    def object_right_click_event(self, event):
        # Get tags of current element
        current = event.widget.find_withtag("current")[0]
        tag = self.canvas.gettags(current)[1]

        # Extract index from element
        index = ""
        for s in tag:
            if s.isnumeric():
                index += s
        
        
        active = self.data[int(index)]

        dist = []
        for i in range(len(data)):
            dist.append(math.sqrt(pow((active.x-data[i].x),2)+pow((active.y-data[i].y),2)))

        for i in range(0,5):
            print(i)

 
       
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
    data = load_csv("data2.csv")
    # scatter_plot(data)
    sp = ScatterPlot(data)
    sp.scatter_plot()