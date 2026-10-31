using System;
using UnityEngine;
using Xunit;

public class SentryDrone : MonoBehaviour
{
    [SerializeField] private float speed = 2f;
    [SerializeField] private float alertRange = 5f;
    [SerializeField] private Transform target;

    public event Action<float> TargetSpotted;

    void Start()
    {
        Debug.Log("Sentry online");
    }

    void Update()
    {
        transform.Rotate(0f, speed * 90f * Time.deltaTime, 0f);
        if (target == null) return;
        float d = Vector3.Distance(transform.position, target.position);
        if (d < alertRange) TargetSpotted?.Invoke(d);
    }

    public static bool InRange(float distance, float range) => distance < range;
}

public class SentryDroneTests
{
    [Fact]
    public void DetectsTargetInsideRange()
    {
        Assert.Equal(true, SentryDrone.InRange(3f, 5f));
    }
}
