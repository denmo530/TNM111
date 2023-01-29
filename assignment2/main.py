import pandas as pd
import tkinter as tk
import math

class Point:
  def __init__(self,x,y,type):
    self.x = x
    self.y= y
    self.type = type

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

def scatter_plot(data): 
    window = tk.Tk()
    window.title("Scatter Plot")
    canvas = tk.Canvas(window, width=800, height=800)
    canvas.pack()   
    # Draw axis x and y
    # create_line(x1, y1, x2, y2)
    canvas.create_line(50, 400, 750, 400, fill="red", width=5)
    canvas.create_line(400, 750, 400, 50, fill="green", width=5)
    canvas.create_text(700, 700, text="X-axis")
    canvas.create_text(25, 25, text="Y-axis")
    origo = {400,400}
    # Get min and max values
    xMin = min(data,key=lambda point:point.x)
    yMin = min(data,key=lambda point:point.y)
    xMax = max(data,key=lambda point:point.x)
    yMax = max(data,key=lambda point:point.y)

    # Ranges for x and y
    x_range = round(max(abs(xMin.x), abs(xMax.x)))
    y_range = round(max(abs(yMin.y), abs(yMax.y)))

    
    # Hela är 700 px
    
    # Draw ticks (X)
    for i in range(-x_range, x_range+1, round(x_range*2/11)): 
        # x = 50 + (350 / x_range) * i
        x = round(400 + i*(350/x_range))
        canvas.create_line(x, 385, x, 415, width=1)   
        canvas.create_text(round(x), 430, text=str(i))
    # Y
    for i in range(-y_range, y_range+1, round(y_range*2/11)): 
        y = round(400 - i*(350/y_range))
        canvas.create_line(385, y, 415, y, width=1)   
        canvas.create_text(430, y, text=str(i))

    for point in data:
        point.x = 400 + point.x * (350/x_range)
        point.y = 400 - point.y * (350/y_range)
        # point.y = round(400 - i*(350/x_range))
        canvas.create_oval(point.x-5, point.y-5, point.x+5, point.y+5, fill="red")

    window.mainloop()
 
  


def canvas_click_event(self, event):
        print('Clicked canvas: ', event.x, event.y, event.widget)
    
if __name__ == "__main__":
    data = load_csv("data1.csv")
    scatter_plot(data)
