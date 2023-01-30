# import pandas as pd
import tkinter as tk
import numpy as np
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
        self.highlighted = False
        self.latest_move = [0,0]
        self.closest_points = []

   
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
                element = self.canvas.create_oval(point.x-5, point.y-5, point.x+5, point.y+5, fill=COLORS[index], tags=["point", f"shape{i}", f"{COLORS[index]}"])
            elif index == 1:
                element = self.canvas.create_rectangle(point.x-5, point.y-5, point.x+5, point.y+5, fill=COLORS[index], tags=["point", f"shape{i}", f"{COLORS[index]}"])                
            else:
                element = self.canvas.create_text(point.x, point.y, text="+", fill=COLORS[index], font=("Purisa", 30), tags=["point", f"shape{i}", f"{COLORS[index]}"])
                     
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
        # DRAW LEGEND
        ####################
        i=0
        while (i < len(types)):
            shape = ['circle', 'square', 'plus']
            leg = tk.Label(window, text=str(shape[i])+" : "+str(COLORS[i])).place(relx=0.95, rely=0.1+0.05*i, anchor="ne")

            i = i+1


        window.mainloop()


    def object_left_click_event(self, event):

        points = self.canvas.find_withtag("point")
   
        # Different actions depending on already translated
        if self.translated:
            self.translated = False

            # Move all points back to original
            for i in points:
                self.canvas.move(i, -self.latest_move[0], -self.latest_move[1])
                # Switch color back to ordinary
                colorTag = self.canvas.gettags(i)[2]
                self.canvas.itemconfig(i, fill=colorTag)
            
        else:
            self.translated = True
            # Move points
            move_x = 400-event.x
            move_y = 400-event.y
            self.latest_move = [move_x, move_y]           
                    
            # Loop through all points with tag "point"
            for i in range(len(points)):
                self.canvas.move(points[i], move_x, move_y)
                tag = self.canvas.gettags(points[i])[1]
                
                # Extract index from element
                index = ""
                for s in tag:
                    if s.isnumeric():
                        index += s
                
                p = self.canvas.coords(points[i])
             
                # Change color
                if p[0] > 400 and p[1] > 400:
                    self.canvas.itemconfig(points[i], fill="red")
                elif p[0] > 400 and p[1] < 400:
                    self.canvas.itemconfig(points[i], fill="blue")                
                elif p[0] < 400 and p[1] < 400:
                    self.canvas.itemconfig(points[i], fill="black")
                elif p[0] < 400 and p[1] > 400:
                    self.canvas.itemconfig(points[i], fill="orange")

            current = event.widget.find_withtag("current")[0]
            self.canvas.itemconfig(current, fill='yellow')
                

    def object_right_click_event(self, event):
        if self.highlighted: 
            self.highlighted = False
            for p in self.closest_points:
                colorTag = self.canvas.gettags(p)[2]
                self.canvas.itemconfig(p, fill=colorTag)
        else:
            self.highlighted = True
            points = self.canvas.find_withtag("point")

            # Get tags of current element
            current = event.widget.find_withtag("current")[0]
        
            active = self.canvas.coords(current)            

            dist = []   
            p = []
            for point in points:
                co = self.canvas.coords(point)
                d = math.sqrt(pow((active[0]-co[0]),2)+pow((active[1]-co[1]),2))  
                            
                if d > 0:                 
                    dist.append(d)
                    # p.append(point)
            closest_points_indices = np.argpartition(dist, 5)[:5] 
                
            # Get 5 smallest distances               
            self.closest_points = []

            for i in closest_points_indices:            
                self.canvas.itemconfig(points[i], fill='yellow')                    
                self.closest_points.append(points[i])            
                
       
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
    sp.scatter_plot()