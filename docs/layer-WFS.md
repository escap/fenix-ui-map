
*SQL View for WFS layer with parametric country code*

```sql
SELECT 
    l.geom, c.iso3_code, c.adm0_code, c.continent, c.fast_name
   FROM 
    spatial.gaul0_3857 l,
    geo_conversion_table c
  WHERE 
   l.adm0_code::text = c.adm0_code
 AND (
c.iso3_code::text = '%iso3_code%' OR 
c.adm0_code::text = '%adm0_code%')

```
