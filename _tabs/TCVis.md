---
layout: page
---

## Hurricane Visualization 

**Background:**
One way that researchers and scientists learn about hurricanes is to study their tracks using data from various weather agencies. The tracks of hurricanes can bring to light several insights by examining the life cycle of the hurricane, including the direction and speed of the hurricane, the evolution of the hurricane’s intensity, and any landfall locations. Together, these insights enable scientists and emergency managers to prepare for future hurricanes by detailing the paths of past hurricanes.


### Problem Statement: 
Unfortunately, there are not many open source software that can easily provide scientists and emergency managers. One current package in Python called [Tropycal](https://tropycal.github.io/tropycal/index.html) provides a way to simplify the process of retrieving and analyzing tropical cyclone data (Fig. 1). This tool allows for quick visualization of a given tropical cyclone using data obtained from various datasets such as HURDAT, IBTrACS reanalysis, and National Hurricane Center Best Track data.
While this tool provides many benefits, it lacks the ability to show additional information that may be useful. For example, it would be useful to know the date of each dot during the lifetime of the storm to better understand the context of when the tropical cyclone is moving. In addition, it would be useful to know the maximum sustained wind speed and minimum sea level pressure (SLP) of the tropical cyclone at any given point. This information is readily available from many weather agencies, and by including these into a visual would provide a comprehensive graphic that could be useful to various key stakeholders.

### Dataset: 
I utilized data collected by the National Oceanic and Atmospheric Administration (NOAA) contained within the International Best Track Archive and Climate Stewardship (IBTrACS). This dataset, available as a CSV or netCDF, details the time, position, and characteristics of every tropical cyclone identified across various global weather agencies

### Method:
The goal of this project is to create software that produces a comprehensive visual of the lifecycle of a hurricane using two user input arguments: the name and year of a tropical cyclone. To this end, I wrote a set of functions and commands in Python to pull data from IBTrACS and produce a visual that can be automated for various tropical cyclones.

### Snippet of Main Code: 
This function reads in the IBTraCS CSV, selects the data from the year entered, and extracts all the necessary variable values.
```
def get_by_name(name: str, year: int, ibtrack_file: str):
    data = pd.read_csv(ibtrack_file, low_memory=False)
    data = data.iloc[1: , :] # remove the row of units
    year_date_of = pd.to_datetime(f'{year}')
    year_date_after = pd.to_datetime(f'{year+1}')
    data = data[data['NAME'] == name]
    data['ISO_TIME'] = pd.to_datetime(data['ISO_TIME'])
    mask = (data['ISO_TIME'] >= year_date_of) & (data['ISO_TIME'] <
year_date_after)
    data = data[mask]
    extract_vars = ['NAME', 'ISO_TIME', 'WMO_WIND', 'WMO_PRES', 'LAT', 'LON',
                    'USA_R34_NE', 'USA_R34_NW', 'USA_R34_SE', 'USA_R34_SW',
'USA_R50_NE', 'USA_R50_NW', 'USA_R50_SE', 'USA_R50_SW', 'USA_R64_NE', 'USA_R64_NW',
'USA_R64_SE', 'USA_R64_SW',
                   'REUNION_R34_NE', 'REUNION_R34_NW', 'REUNION_R34_SE',
'REUNION_R34_SW', 'REUNION_R50_NE', 'REUNION_R50_NW', 'REUNION_R50_SE',
'REUNION_R50_SW', 'REUNION_R64_NE', 'REUNION_R64_NW', 'REUNION_R64_SE',
'REUNION_R64_SW',
                   'BOM_R34_NE', 'BOM_R34_SE', 'BOM_R34_NW', 'BOM_R34_SW',
'BOM_R50_NE', 'BOM_R50_SE', 'BOM_R50_NW', 'BOM_R50_SW', 'BOM_R64_NE', 'BOM_R64_SE',
'BOM_R64_NW', 'BOM_R64_SW']
    data = data[extract_vars]
    if year != 2021:
        data = data[data['WMO_WIND'] != ' ']
        data = data[data['WMO_PRES'] != ' ']
    data['LON_180'] = data['LON']
    data['LON']=data['LON'].astype(float).apply(LonTo360)
    return data
```

The Python code leveraged several state-of-the-art libraries including Cartopy, Matplotlib, Numpy, Xarray, and Pandas to read the data and produce the data visualizations. I began by taking the user input arguments and subsetting the IBTrACS data for the specific tropical cyclone. Thereafter, I placed this data into a Pandas DataFrame to then plot using Cartopy and Matplotlib on a geospatial map. The annotations used the IBTrACS information to dynamically detail the life cycle of the tropical cyclone. The end result is a visualization of the tropical cyclone’s path and its physical characteristics. An example is shown in Fig. 2.

