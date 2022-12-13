import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DrawingManager,
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Drawer, Popover, Space } from "antd";
import { useMutation } from "@tanstack/react-query";
import landApi from "../../../../api/land";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import * as turf from "@turf/turf";
import { useSelector } from "react-redux";
import { formatMoment } from "../../../../utils/formatMoment";
import moment from "moment";

const mapContainerStyle = {
  height: "500px",
  width: "1050px",
};

const outerCoords = [
  { lat: -32.364, lng: 153.207 }, // north west
  { lat: -35.364, lng: 153.207 }, // south west
  { lat: -35.364, lng: 158.207 }, // south east
  { lat: -32.364, lng: 158.207 }, // north east
];

const onLoad = (drawingManager: any) => {
  drawingManager?.map?.data?.add([
    {
      lat: 10.099247039652582,
      lng: 105.68368561328126,
    },
    {
      lat: 10.001887453457732,
      lng: 105.9830630546875,
    },
    {
      lat: 9.965370069606989,
      lng: 105.68093903125,
    },
  ]);
};

const handleMouseOut = (e: any) => {
  console.log(e.latLng);
};

function Map() {
  const [finalPolygon, setFinalPolygon] = useState();
  const [center, setCenter] = useState<any>({
    lat: 10.045162,
    lng: 105.746857,
  });

  const [area, setArea] = useState<number | null>();

  const [drawShape, setDrawShape] = useState("");
  const location: any = useLocation();
  const [detailland, setDetailLand] = useState<any>();

  const navigate = useNavigate();
  const ref: any = useRef();
  const postion: any = location.state?.position?.address || "";
  const editPosition = location.state?.preview;
  const user = useSelector((state: any) => state.user?.user);

  const isEdit = !!editPosition;

  // useEffect(() => {
  //   const hander = (event: any) => {
  //     event.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", (event) => hander(event));

  //   return () =>
  //     document.removeEventListener("contextmenu", (event) => hander(event));
  // }, []);

  useEffect(() => {
    (async () => {
      setDetailLand(location.state?.position);
      try {
        const res: any = await axios.get(
          "https://geocoder.ls.hereapi.com/6.2/geocode.json?searchtext=" +
            postion +
            "&gen=9&apiKey=PTfk9cxS5nhkaA1zl0_UyvbgplyvsQlu6dv5kVIloMw"
        );
        const position =
          res.data?.Response?.View[0]?.Result[0]?.Location?.DisplayPosition;

        if (position) {
          setCenter({
            lat: position.Latitude || "",
            lng: position.Longitude || "",
          });
        }
      } catch (error) {}
    })();
  }, [postion]);

  const onPolygonComplete = (polygon: any) => {
    polygon.setMap(null);
    const coords = polygon
      .getPath()
      .getArray()
      .map((coord: any) => {
        return {
          lat: coord.lat(),
          lng: coord.lng(),
        };
      });

    setFinalPolygon(coords);

    const transformData = coords.map((item: any) => {
      return [item?.lat, item?.lng];
    });

    const area = turf.area({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [transformData],
      },
    } as any);

    const rounded_area = Math.round((area * 100) / 100);

    if (rounded_area) {
      setArea(rounded_area);
      setOpen(true);
    }

    setDrawShape(JSON.stringify(coords, null, 1));
    setPath(JSON.stringify(coords, null, 1));
  };

  console.log(location.state?.position?.location);

  const [path, setPath] = useState(
    isEdit ? JSON.parse(location.state?.position?.location) : []
  );

  // Define refs for Polygon instance and listeners
  const polygonRef = useRef<any>(null);
  const listenersRef = useRef<any>([]);

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng: any) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis: any) => lis.remove());
    polygonRef.current = null;
  }, []);
  // console.log("The path state is", path);
  const onLoad2 = useCallback(
    (polygon: any) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();

      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  const onLoadAt = (autocomplete: any) => {};
  const onLoadMaker = (marker: any) => {
    console.log("marker: ", marker);
  };

  const handleUpdateLand = () => {
    if (Object.keys(detailland || {}).length > 0) {
      delete detailland.thumbnail;

      if (!isEdit) {
        mutation_update_land.mutate(
          {
            ...detailland,
            location: drawShape,
            dientich: area || null,
          },
          {
            onSuccess: (res) => {
              getResponseMessage(res);
            },
            onError: (err) => {
              getErrorMessage(err);
            },
          }
        );
      } else {
        mutation_update_land.mutate(
          {
            ...detailland,
            location: path,
          },
          {
            onSuccess: (res) => {
              getResponseMessage(res);
            },
            onError: (err) => {
              getErrorMessage(err);
            },
          }
        );
      }
    }
  };

  const mutation_update_land = useMutation((data: any) =>
    landApi.update(data, location.state.position?.id_thuadat || "")
  );

  const handleMoseOver = () => {
    console.log(ref.current);

    setTimeout(() => {
      console.log(area);
    }, 200);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  console.log(path, isEdit);

  return (
    <>
      <Drawer
        title="Thông tin thửa đất"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <p>
          Thửa đất có diện tích:{" "}
          <span style={{ fontSize: "16px", marginLeft: "4px" }}>{area}</span>{" "}
          mét vuông
        </p>
        <p>
          Địa chỉ:{" "}
          <span style={{ fontSize: "16px", marginLeft: "4px" }}>
            {location.state?.position.address || ""}
          </span>
        </p>
        <p>
          Xã viên:{" "}
          <span style={{ fontSize: "16px", marginLeft: "4px" }}>
            {user?.fullname || ""}
          </span>
        </p>
        <p>
          Ngày tạo:{" "}
          <span style={{ fontSize: "16px", marginLeft: "4px" }}>
            {formatMoment(moment(new Date()))}
          </span>
        </p>
      </Drawer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Cập nhật vị trí thửa đất</h2>
        <div>
          <Space>
            <Button
              loading={mutation_update_land.isLoading}
              onClick={() => navigate("/htx/manage-land")}
            >
              Trở về
            </Button>
            <Button
              loading={mutation_update_land.isLoading}
              onClick={handleUpdateLand}
              type="primary"
            >
              Cập nhật
            </Button>
          </Space>
        </div>
      </div>
      <LoadScript
        libraries={["drawing"]}
        googleMapsApiKey="AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8"
      >
        <GoogleMap
          mapTypeId="hybrid"
          mapContainerStyle={mapContainerStyle}
          zoom={isEdit ? 18 : 16}
          center={center}
        >
          {!isEdit && <Marker onLoad={onLoadMaker} position={center} />}
          {isEdit && (
            <Polygon
              ref={ref}
              editable
              draggable
              path={path}
              onMouseUp={onEdit}
              // Event used when dragging the whole Polygon
              onDragEnd={onEdit}
              onLoad={onLoad2}
              onUnmount={onUnmount}
              key={1}
              options={{
                strokeColor: "#c69",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#c69",
                fillOpacity: 0.35,
              }}
            />
          )}
          <Polygon
            ref={ref}
            editable
            draggable
            path={finalPolygon || []}
            onMouseUp={onEdit}
            // Event used when dragging the whole Polygon
            onDragEnd={onEdit}
            onLoad={onLoad2}
            onRightClick={(e: any) => {
              // e.preventDefault();
              setOpen(true);
            }}
            onUnmount={onUnmount}
            key={1}
            options={{
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillOpacity: 0.35,
            }}
          />
          <DrawingManager
            options={{
              drawingControl: true,
              // polygonOptions: { editable: true },
              polygonOptions: {
                strokeOpacity: 1.0,
                strokeWeight: 3,
                fillOpacity: 0.3,
                draggable: true,
                editable: true,
                paths: path,
                clickable: false,
                geodesic: true,
              },
            }}
            onLoad={onLoad}
            onPolygonComplete={onPolygonComplete}
          ></DrawingManager>
        </GoogleMap>
      </LoadScript>
    </>
  );
}

export default React.memo(Map);
